import { app, serverTimestamp, getAuth } from './firebase';
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

class ModelBase {
  timestamp;

  constructor() {
    this.timestamp = serverTimestamp();
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
  constructor(id, description, image, user) {
    super();
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
      UserModel.fromUser(post.user)
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
  constructor(id, user, message, postId) {
    super();
    this.id = id;
    this.user = user;
    this.message = message;
    this.postId = postId;
  }

  static fromComment(id, postId, comment) {
    return new CommentModel(
      id,
      comment.user,
      comment.message,
      postId
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

export class ProfileModel extends ModelBase {
  id = '';
  name = '';
  email = '';
  phone = 'não informado';
  photoURL = '';
  createdAt = null;
  lastLoginAt = null;

  constructor(id, name, email, phone, photoURL) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.photoUrl = photoURL;
  }

  static fromJson(user, displayName) {
    return new ProfileModel(
      user.uid,
      displayName,
      user.email,
      user.phoneNumber || '',
      user.photoURL || ''
    );
  }

  toSave() {
    return {
      uid: this.id,
      displayName: this.name,
      email: this.email,
      phoneNumber: this.phone,
      photoURL: this.photoUrl,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }
  }
}