import { app, serverTimestamp, getAuth } from './firebase';
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * A base class for models.
 * @class ModelBase
 */
class ModelBase {
  timestamp;

  /**
   * Creates an instance of _ModelBase_.
   * @param {Timestamp} timestamp firebase _Timestamp_ or _null_ to have the value filled on server side.
   * @memberof ModelBase
   */
  constructor(timestamp) {
    this.timestamp = timestamp ?? serverTimestamp();
  }

  /**
   * Returns a user friendly string containing
   * when this record was created.
   * @return {String} a formatted relative date and time. Ex: "5 minutes ago".
   * @memberof ModelBase
   */
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

  /**
   * Convert an instance of this class to an _Object_.
   * @return {object} this class instance converted to _Object_.
   * @memberof ModelBase
   */
  toObject() {
    return {...this}
  }
}

/**
 * Represents an simple user to be used as reference inside others models. *
 * @export UserModel
 * @class UserModel
 * @extends {ModelBase}
 */
export class UserModel extends ModelBase {

  /**
   * Creates an instance of _UserModel_.
   * @param {String} user the user id.
   * @param {String} name the user display name.
   * @memberof UserModel
   */
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }

  /**
   * Convert an _Object_ with an id and a name to a _UserModel_ instance.
   * @static
   * @param {Object} user { id: String, name: String }
   * @return {UserModel} An instance of a _UserModel_.
   * @memberof UserModel
   */
  static fromUser(user) {
    return new UserModel(user.id, user.name);
  }

  /**
   * Create an instance of _UserModel_ from the current logged user.
   * @static
   * @return {UserModel} an instance of _UserModel_.
   * @memberof UserModel
   */
  static fromAuth() {
    return new UserModel(getAuth(app).currentUser.uid, getAuth(app).currentUser.displayName);
  }
}

/**
 * Represents a reference to an image in firestore.
 * @export ImageModel
 * @class ImageModel
 * @extends {ModelBase}
 */
export class ImageModel extends ModelBase {
  /**
   * Creates an instance of _ImageModel_.
   * @param {String} id the identifier for the image in firestore. It's the file name with extension.
   * @param {*} url the absolute url for the image in firestore.
   * @memberof ImageModel
   */
  constructor(id, url) {
    super();
    this.url = url;
    this.id = id;
  }

  /**
   * Converts an image _Object_ to a instance of a _ImageModel_.
   * @static
   * @param {Object} image { id: String, url: String }
   * @return {UserModel} An instance of a _UserModel_.
   * @memberof ImageModel
   */
  static fromImage(image) {
    return new ImageModel(image.id, image.url);
  }
}

/**
 * Represents a publication with image, description and user.
 * @export PostModel
 * @class PostModel
 * @extends {ModelBase}
 */
export class PostModel extends ModelBase {
  /**
   * Creates an instance of _PostModel_.
   * @param {String} id the post id.
   * @param {String} description the post description.
   * @param {Object} image an _Object_ from _ImageModel_. { id: _String_, url: _String_ }
   * @param {Object} user an _Object_ from _UserModel_. { id: _String_, name: _String_ }
   * @param {TimeStamp} timestamp when the post was published.
   * @memberof PostModel
   */
  constructor(id, description, image, user, timestamp) {
    super(timestamp);
    this.id = id;
    this.description = description;
    this.image = image;
    this.user = user;
  }

  /**
   * Creates an _PostModel_ instance from an post _Object_.
   * @static
   * @param {String} id the posts id.
   * @param {Object} post {
   *  description: _String_,
   *  image: {
   *    id: _String_, url: _String_
   *  },
   *  user: {
   *    id: _String_, name: _String_
   *  }
   * }
   * @return {PostModel}  an instance of _PostModel_.
   * @memberof PostModel
   */
  static fromPost(id, post) {
    return new PostModel(
      id,
      post.description,
      ImageModel.fromImage(post.image),
      UserModel.fromUser(post.user),
      post.timestamp
    );
  }

  /**
   * Returns an _Object_ read to be submitted to firestore.
   * @return {Object} an _Object_ read to be submitted to firestore.
   * @memberof PostModel
   * @return {PostModel} an _Object_ ready to be submitted to firestore.
   */
  toSave() {
    return {
      description: this.description,
      image: this.image.toObject(),
      user: this.user.toObject(),
      timestamp: serverTimestamp()
    }
  }
}

/**
 * Represents a like in a publication.
 * @export LikeModel
 * @class LikeModel
 * @extends {ModelBase}
 */
export class LikeModel extends ModelBase {
  /**
   * Creates an instance of _LikeModel_.
   * @param {String} id the like id.
   * @param {*} user an _Object_ from _UserModel_. { id: _String_, name: _String_ }
   * @param {*} postId the publication id.
   * @param {*} timestamp when the like was created.
   * @memberof LikeModel
   */
  constructor(id, user, postId, timestamp) {
    super(timestamp);
    this.id = id;
    this.user = user;
    this.postId = postId;
  }

  /**
   * Creates an instance of _LikeModel_ from an _Object_.
   * @static
   * @param {String} id the like id.
   * @param {String} postId the publication id.
   * @param {Object} like an like _Object_ { user: _String_, timestamp: _TimeStamp_ }
   * @return {LikeModel} an instance of _LikeModel_.
   * @memberof LikeModel
   */
  static fromJson(id, postId, like) {
    return new LikeModel(
      id,
      like.user,
      postId,
      like.timestamp
    );
  }

  /**
   * Returns an _Object_ read to be submitted to firestore.
   * @return {Object} an _Object_ read to be submitted to firestore.
   * @memberof LikeModel
   * @return {LikeModel} an _Object_ ready to be submitted to firestore.
   */
  toSave() {
    return {
      user: this.user.toObject(),
      postId: this.postId,
      timestamp: serverTimestamp()
    }
  }
}

/**
 * Represents a comment in a publication.
 * @export CommentModel
 * @class CommentModel
 * @extends {ModelBase}
 */
export class CommentModel extends ModelBase {
  /**
   * Creates an instance of _CommentModel_.
   * @param {String} id the comment id.
   * @param {Object} user an _Object_ from _UserModel_. { id: _String_, name: _String_ }
   * @param {String} message the comment message.
   * @param {String} postId the post id.
   * @param {TimeStamp} timestamp when the comment was created.
   * @memberof CommentModel
   */
  constructor(id, user, message, postId, timestamp) {
    super(timestamp);
    this.id = id;
    this.user = user;
    this.message = message;
    this.postId = postId;
  }

  /**
   * Creates an instance of a _CommentModel_ from an _Object_.
   * @static
   * @param {String} id the comment id.
   * @param {String} postId the post id.
   * @param {Object} comment an comment _Object_ { message: _String_, timestamp: _Timestamp_, user: { id: _String_, name: _String_ } }
   * @return {CommentModel} an instance of a _CommentModel_.
   * @memberof CommentModel
   */
  static fromComment(id, postId, comment) {
    return new CommentModel(
      id,
      comment.user,
      comment.message,
      postId,
      comment.timestamp
    );
  }

  /**
   * Returns an _Object_ read to be submitted to firestore.
   * @return {Object} an _Object_ read to be submitted to firestore.
   * @memberof CommentModel
   * @return {CommentModel} an _Object_ ready to be submitted to firestore.
   */
  toSave() {
    return {
      user: this.user.toObject(),
      message: this.message,
      timestamp: serverTimestamp(),
      postId: this.postId
    }
  }
}

/**
 * Takes either a _Date_, a _Number_ or a _Timestamp_ and returns a _Date_.
 * @export parseToDate
 * @param {any} value _null_, a _Date_, a _Number_ or a _Timestamp_.
 * @return {Date} a _Date_ instance or _null_.
 */
export function parseToDate(value) {
  if (!value)
    return null;

   if (value instanceof Date)
   	return value;

  if (Number.isFinite(value))
    return new Date(value * 1);

  return value?.toDate?.();
}

/**
 * Takes either a _Date_, a _Number_ or a _Timestamp_ and returns a formatted _Date_ as _String_.
 * @export toFormattedDate
 * @param {any} value _null_, a _Date_, a _Number_ or a _Timestamp_.
 * @param {String} [fmt='dd/MM/yyyy HH:mm'] a format _String_.
 * @return {String} a _String_ with the formatted _Date_.
 */
export function toFormattedDate(value, fmt = 'dd/MM/yyyy HH:mm') {
  const date = parseToDate(value);
  if (!date)
    return '';

  return format(date, fmt)
}

/**
 * Represents a user profile. It's not the same as the _UserModel_ or the firebase auth user.
 * It' add some new properties to be used when showing the user's profile.
 * @export ProfileModel
 * @class ProfileModel
 * @extends {ModelBase}
 */
export class ProfileModel extends ModelBase {
  uid = '';
  displayName = '';
  email = '';
  phoneNumber = '';
  photoURL = '';
  createdAt = null;
  lastLoginAt = null;

  /**
   * Creates an instance of _ProfileModel_.
   * @param {String} uid the user id. Refers to the auth user id in firebase.
   * @param {String} displayName the user display name or username.
   * @param {String} email the user email.
   * @param {String} phone the user phone number.
   * @param {String} photoURL the url for the user profile picture.
   * @param {TimeStamp} createdAt when the profile was created.
   * @param {TimeStamp} lastLoginAt the last time the user was logged in.
   * @memberof ProfileModel
   */
  constructor(id, uid, displayName, email, phone, photoURL, createdAt, lastLoginAt) {
    super();
    this.id = id;
    this.uid = uid;
    this.displayName = displayName;
    this.email = email;
    this.phoneNumber = phone;
    this.photoURL = photoURL;
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
  }

  /**
   * Returns a _UserModel_ from this _ProfileModel_.
   * @returns an _UserModel_.
   */
  toUser() {
    return new UserModel(this.uid, this.displayName);
  }

  /**
   * Creates an instance of _ProfileModel_ from an _Object_.
   * @static
   * @param {Object} value { id: _String_, uid: _String_, displayName: _String_, email: _String_, phoneNumber: _String_, photoURL: _String_, createdAt: _Timestamp_, lastLoginAt: _Timestamp_ }
   * @return {ProfileModel} an instance of _ProfileModel_.
   * @memberof ProfileModel
   */
  static fromJson(id, value) {
    return new ProfileModel(
      id,
      value.uid,
      value.displayName,
      value.email,
      value.phoneNumber || '',
      value.photoURL || '',
      value.createdAt,
      value.lastLoginAt
    );
  }

  /**
   * Returns an _Object_ read to be submitted to firestore.
   * @return {Object} an _Object_ read to be submitted to firestore.
   * @memberof ProfileModel
   * @return {ProfileModel} an _Object_ ready to be submitted to firestore.
   */
  toSave() {
    return {
      uid: this.uid,
      displayName: this.displayName ?? this.email,
      email: this.email,
      phoneNumber: this.phoneNumber,
      photoURL: this.photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    }
  }
}