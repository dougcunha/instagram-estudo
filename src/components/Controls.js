import { useState } from "react";
import { addComment } from "../data/db";
import { usePostContext } from "./Post";

export function BtnPublish({disabled, value}) {
  return (
    <input type="submit" value={value ?? "Publicar"} disabled={disabled} />
  );
}

export function BtnEmoji() {
  const { setInfoMessage } = usePostContext();

  function showEmojis(e) {
    e.preventDefault();

    setInfoMessage(`
      Ainda estamos implementando os Emojis.
      No windows você pode chamar o diálogo padrão de emojis usando a tecla Win + .
    `);
  }

  return (
    <button className='btn-emoji-list material-icons-outlined' onClick={e => showEmojis(e)}>
      emoji_emotions
    </button>
  )
}

export function FormComment() {
  const {
    post,
    setAlertMessage,
    setErrorMessage,
  } = usePostContext();

  const [comment, setComment] = useState(null);

  async function newComment(id, e) {
    e.preventDefault?.();
    const commentEl = document.getElementById(`comment-${id}`);

    if (!commentEl.value)
    {
      setAlertMessage('Digite uma mensagem antes de enviar.');
      return;
    }

    try {
      await addComment(id, commentEl.value);
      commentEl.value = '';
      setComment(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function setCommentTxt(e) {
    const txt = document.getElementById(`comment-${post.id}`)?.value;
    setComment(txt);
  }

  return (
    <form className='form-add-comment' id={`form-add-comment-${post.id}`} onSubmit={e => newComment(post.id, e)}>
      <BtnEmoji />
      <textarea
        id={`comment-${post.id}`}
        placeholder="Adicione um comentário..."
        onChange={e => setCommentTxt(e)}
      />
      <BtnPublish disabled={comment ? false : true}/>
    </form>
  );
}