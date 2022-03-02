import {
  app,
  createUserWithEmailAndPassword,
  getFirestore,
  deleteObject,
  getStorage,
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
  PostModel,
  ProfileModel,
  UserModel
} from '../modelos.js';

export async function createUser(email, password, displayName) {
  try {
    const authUser = await createUserWithEmailAndPassword(getAuth(app), email, password);
    await addProfile(authUser.user, email, displayName);
  } catch (error) {
    console.error(error)
    throw error;
  }
}

export async function addProfile(user, email, displayName, photoURL) {
  try {
    await updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL
    });

    const profile = new ProfileModel(
      user.uid,
      displayName,
      email,
      '',
      ''
    );

    await addDoc(collection(getFirestore(app), 'profiles'), profile.toSave());
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addComment(postId, message) {
  await addDoc(
    collection(getFirestore(app),
    `posts/${postId}/comments`),
    new CommentModel(null, UserModel.fromAuth(), message).toSave()
  );
}

export async function deleteComment(postId, commentId) {
  await deleteDoc(doc(getFirestore(app), `posts/${postId}/comments`, commentId));
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

export async function getUserProfile(userId) {
  const postsRef = collection(getFirestore(app), 'profiles')
  const q = query(postsRef, where('uid', '==', userId));
  const snap = await getDocs(q);

  if (snap.docs.length === 0)
  {
    console.log('Não achou o perfil ' + userId);

    return;
  }

  const user = snap.docs[0].data();

  return ProfileModel.fromJson(user).toObject();
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    // eslint-disable-next-line
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function sendFile(file, onProgress, onSuccess, onError) {
  const tipo = file.name.split('.').pop();
  const fileId = `${uuidv4()}.${tipo}`;
  const storage = getStorage(app);
  const fileRef = ref(storage, `images/${fileId}`);
  const task = uploadBytesResumable(fileRef, file);

  task
    .on("stage_changed",
      snap => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      error => onError(error),
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