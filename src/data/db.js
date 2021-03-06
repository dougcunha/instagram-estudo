import {
  app,
  createUserWithEmailAndPassword,
  getFirestore,
  deleteObject,
  getStorage,
  setDoc,
  doc,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  updateProfile,
  getAuth,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  where,
  collection,
  query,
  orderBy,
  onSnapshot
} from '../firebase.js';

import {
  CommentModel,
  ImageModel,
  LikeModel,
  PostModel,
  ProfileModel,
  UserModel
} from '../models.js';

export async function createUser(email, password, displayName) {
  try {
    const authUser = await createUserWithEmailAndPassword(getAuth(app), email, password);
    await addProfile(authUser.user, email, displayName);
  } catch (error) {
    console.error(error)
    throw error;
  }
}

/**
 *  Create an user profile.
 * @export addProfile
 * @param {*} user the current user from _getAuth(app).currentUser_;
 * @param {*} email the user email or null to use the current email.
 * @param {*} displayName the display name or null to use the current display name.
 * @param {*} photoURL the photo URL or null to use the current photo URL.
 */
export async function addProfile(user, email, displayName, photoURL) {
  try {
    if (displayName || photoURL)
      await updateProfile(user, {
        displayName: displayName ?? user.displayName,
        photoURL: photoURL ?? user.photoURL
      });

    const profile = new ProfileModel(
      null,
      user.uid,
      displayName ?? user.displayName,
      email ?? user.email,
      '',
      photoURL ?? user.photoURL ?? ''
    );

    return await addDoc(collection(getFirestore(app), 'profiles'), profile.toSave());
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updProfile(user, profile) {
  try {
    const data = ProfileModel.fromJson(profile.id, profile).toSave();

    await updateProfile(user, {
      displayName: profile.displayName,
      photoURL: profile.photoURL
    });

    const docRef = doc(getFirestore(app), 'profiles', profile.id);
    await setDoc(docRef, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addComment(postId, message) {
  await addDoc(
    collection(getFirestore(app),
    `posts/${postId}/comments`),
    new CommentModel(null, UserModel.fromAuth(), message, postId).toSave()
  );
}

export async function addLike(postId, user) {
  await addDoc(
    collection(getFirestore(app),
    `posts/${postId}/likes`),
    new LikeModel(null, UserModel.fromAuth(user), postId).toSave()
  );
}

export async function deleteComment(postId, commentId) {
  await deleteDoc(doc(getFirestore(app), `posts/${postId}/comments`, commentId));
}

export async function getLike(postId) {
  const postsRef = collection(getFirestore(app), `posts/${postId}/likes`)
  const q = query(postsRef, where('user.id', '==', getAuth(app).currentUser.uid));
  const snap = await getDocs(q);

  if (snap.docs.length === 0)
    return;

  const like = snap.docs[0].data();

  return LikeModel.fromJson(snap.docs[0].id, postId, like).toObject();
}

export async function deleteLike(like) {
  if (like)
    await deleteDoc(doc(getFirestore(app), `posts/${like.postId}/likes`, like.id));
}

export async function deleteFromStorage(imgId) {
  console.log('Apagando o arquivo ' + imgId);
  const imgRef = ref(getStorage(app), `images/${imgId}`);
  await deleteObject(imgRef);
}

export async function deletePost(postId) {
  const docRef = doc(getFirestore(app), `posts`, postId);
  const post = await getDoc(docRef);
  const imgId = post.data().image.id;
  await deleteDoc(docRef);
  await deleteFromStorage(imgId);
}

export async function getUserProfile(userId, createIfNotExists=false) {
  const postsRef = collection(getFirestore(app), 'profiles')
  const q = query(postsRef, where('uid', '==', userId));
  const snap = await getDocs(q);

  if (snap.docs.length === 0)
  {
    console.log('N??o achou o perfil ' + userId);
    if (!createIfNotExists)
      return;

    const doc = await addProfile(getAuth(app).currentUser);
    const snap = await getDocs(q);
    return ProfileModel.fromJson(doc.id, snap.docs[0].data()).toObject();
  }

  const doc = snap.docs[0];

  return ProfileModel.fromJson(doc.id, doc.data()).toObject();
}

function getNewUuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    // eslint-disable-next-line
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function sendFile(file, onProgress, onSuccess, onError, path='images', filename=null) {
  const type = file?.name?.split('.').pop();
  const fileId = filename ?? `${filename || getNewUuid()}.${type}`;
  const storage = getStorage(app);
  const fileRef = ref(storage, `${path}/${fileId}`);
  const task = uploadBytesResumable(fileRef, file);

  function getPercent(snap) {
    const percent = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
    console.log(percent);

    return percent;
  }

  task
    .on("stage_changed",
      snap => onProgress?.(getPercent(snap)),
      error => onError?.(error),
      () => {
        getDownloadURL(task.snapshot.ref)
          .then(url => onSuccess(url, fileId))
      }
    );
}

export function addPost(file, description, onProgress, onSuccess, onError) {
  sendFile(
    file,
    onProgress,
    (url, imgId) => {
      addDoc(
        collection(getFirestore(app),
        'posts/'),
        new PostModel(
          null,
          description,
          new ImageModel(imgId, url),
          UserModel.fromAuth()
        ).toSave()
      ).then(_ => onSuccess());
    },
    onError
  );
}

export async function subscribeToPosts(onPosts) {
  const q = query(collection(getFirestore(app), "posts"), orderBy('timestamp', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs;
    const posts = docs.map(item => PostModel.fromPost(item.id, item.data()))
    onPosts(posts)
  });
}

export async function subscribeToComments(postId, setComments) {
  const q = query(collection(getFirestore(app), `posts/${postId}/comments`), orderBy('timestamp', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs;
    const comments = docs.map(item => CommentModel.fromComment(item.id, postId, item.data()))
    setComments(comments)
  });
}

export async function subscribeToLike(postId, setLike) {
  const q = query(
    collection(getFirestore(app), `posts/${postId}/likes`),
    where('user.id', '==', getAuth(app).currentUser.uid)
  );

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs;
    if (docs.length > 0)
    {
      const like = docs[0].data();
      setLike(CommentModel.fromComment(docs[0].id, postId, like))
    } else
      setLike(null);
  });
}

export async function subscribeToLikes(postId, setLikes) {
  const q = query(collection(getFirestore(app), `posts/${postId}/likes`));

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs;

    const likes = docs.map(d => {
      const like = d.data();
      return new LikeModel(d.id, UserModel.fromUser(like.user), postId, like.timestamp);
    });

    setLikes(likes);
  });
}

export async function listLikes(postId) {
  const q = query(collection(getFirestore(app), `posts/${postId}/likes`));
  const snap = await getDocs(q);

  return snap.docs.map(d => {
    const like = d.data();
    return new LikeModel(
      d.id,
      UserModel.fromUser(like.user),
      postId, like.timestamp);
  });
}
