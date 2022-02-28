import firebase from 'firebase/compat/app';
import { auth } from './firebase';
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

class ModelBase {
  timestamp;

  constructor(timestamp) {
    this.timestamp = timestamp || firebase.firestore.FieldValue.serverTimestamp();
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
    return new UserModel(auth.currentUser.uid, auth.currentUser.displayName);
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
      timestamp: this.timestamp
    }
  }
}

export class CommentModel extends ModelBase {
  constructor(id, user, message, timestamp, postId) {
    super(timestamp);
    this.id = id;
    this.user = user;
    this.message = message;
    this.timestamp = timestamp || firebase.firestore.FieldValue.serverTimestamp();
    this.postId = postId;
  }

  static fromComment(id, postId, comment) {
    return new CommentModel(
      id,
      comment.user,
      comment.message,
      comment.timestamp,
      postId
    );
  }

  toSave() {
    return {
      id: this.id,
      user: this.user.toObject(),
      message: this.message,
      timestamp: this.timestamp
    }
  }
}

export class ProfileModel extends ModelBase {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }
}