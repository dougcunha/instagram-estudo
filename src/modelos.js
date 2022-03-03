import { app, serverTimestamp, getAuth } from './firebase';
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

class ModelBase {
  timestamp;

  constructor(timestamp) {
    this.timestamp = timestamp ?? serverTimestamp();
  }

  when() {
    return formatDistanceToNow(
      this.timestamp && this.timestamp.toDate ? this.timestamp.toDate() : Date.now(),
      {
        locale: ptBR,
        addSuffix: true,
        includeSeconds: true
      }
    )
  }

  toObject() {
    return {...this}
  }
}

export class UserModel extends ModelBase {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }

  static fromUser(user) {
    return new UserModel(user.id, user.name);
  }

  static fromAuth() {
    return new UserModel(getAuth(app).currentUser.uid, getAuth(app).currentUser.displayName);
  }
}

export class ImageModel extends ModelBase {
  constructor(id, url) {
    super();
    this.url = url;
    this.id = id;
  }

  static fromImage(image) {
    return new ImageModel(image.id, image.url);
  }
}

export class PostModel extends ModelBase {
  constructor(id, description, image, user, timestamp) {
    super(timestamp);
    this.id = id;
    this.description = description;
    this.image = image;
    this.user = user;
  }

  static fromPost(id, post) {
    return new PostModel(
      id,
      post.description,
      ImageModel.fromImage(post.image),
      UserModel.fromUser(post.user),
      post.timestamp
    );
  }

  toSave() {
    return {
      description: this.description,
      image: this.image.toObject(),
      user: this.user.toObject(),
      timestamp: serverTimestamp()
    }
  }
}

export class CommentModel extends ModelBase {
  constructor(id, user, message, postId, timestamp) {
    super(timestamp);
    this.id = id;
    this.user = user;
    this.message = message;
    this.postId = postId;
  }

  static fromComment(id, postId, comment, timestamp) {
    return new CommentModel(
      id,
      comment.user,
      comment.message,
      postId,
      comment.timestamp
    );
  }

  toSave() {
    return {
      user: this.user.toObject(),
      message: this.message,
      timestamp: serverTimestamp()
    }
  }
}

export function parseToDate(value) {
  if (!value)
    return null;

   if (value instanceof Date)
   	return value;

  if (Number.isFinite(value))
    return new Date(value * 1);

  return value?.toDate?.();
}

export function toFormatedDate(value, fmt = 'dd/MM/yyyy HH:mm') {
  const date = parseToDate(value);
  if (!date)
    return '';

  return format(date, fmt)
}

export class ProfileModel extends ModelBase {
  uid = '';
  displayName = '';
  email = '';
  phoneNumber = 'não informado';
  photoURL = '';
  createdAt = null;
  lastLoginAt = null;

  constructor(uid, displayName, email, phone, photoURL, createdAt, lastLoginAt) {
    super();
    this.uid = uid;
    this.displayName = displayName;
    this.email = email;
    this.phoneNumber = phone;
    this.photoUrl = photoURL;
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
  }

  static fromJson(user) {
    return new ProfileModel(
      user.uid,
      user.displayName,
      user.email,
      user.phoneNumber || '',
      user.photoURL || '',
      user.createdAt,
      user.lastLoginAt
    );
  }

  toSave() {
    return {
      uid: this.uid,
      displayName: this.displayName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      photoURL: this.photoUrl,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }
  }
}