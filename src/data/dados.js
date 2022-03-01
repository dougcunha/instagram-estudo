import {
  app,
  createUserWithEmailAndPassword,
  getFirestore,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot
} from '../firebase.js';

import { CommentModel, ImageModel, PostModel, ProfileModel, UserModel } from '../modelos.js';

export async function createUser(email, password, displayName) {
  try {
    const authUser = await createUserWithEmailAndPassword(email, password);
    await this.updateProfile(authUser.user, email, displayName);
  } catch (error) {
    console.error(error.message)
  }
}

export async function updateProfile(user, email, displayName, photoURL) {
  try {
    await user.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    });

    const profile = new ProfileModel(
      user.uid,
      displayName,
      email,
      '',
      '',
      Date.now(),
      Date.now()
    );

    await getFirestore(app).collection('profiles').add(profile.toSave());
  } catch (error) {
    console.error(error.message);
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
  const doc = getFirestore(app)
    .collection('posts')
    .doc(postId)
    .collection('comentarios')
    .doc(commentId);

  await doc.delete();
}

export async function deleteFromStorage(imgId) {
  console.log('Apagando o arquivo ' + imgId);
  await getStorage(app)
    .ref('images')
    .child(imgId)
    .delete();
}

export async function deletePost(postId) {
  const snap = await getFirestore(app)
    .collection('posts')
    .doc(postId)
    .get();

  const doc = snap.data();
  const imgId = doc.image.id;
  await doc.delete();
  await deleteFromStorage(imgId);
}

export async function getUserProfile(userId) {
  const snap = await getFirestore(app)
    .collection('profiles')
    .where("uid", "==", userId)
    .get();

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


export async function getRealTimeComments(postId, setComments) {
  const q = query(collection(getFirestore(app), `posts/${postId}/comments`), orderBy('timestamp', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const docs = querySnapshot.docs;
    const comments = docs.map(item => CommentModel.fromComment(item.id, postId, item.data()))
    setComments(comments)
  });
}