import { useState } from "react";
import { addComment } from "../data/db";
import { BtnEmoji } from "./BtnEmoji";
import { usePostContext } from "./Post";

export function BtnPublish({id, disabled, value}) {
  return (
    <input id={id} type="submit" value={value ?? "Publicar"} disabled={disabled}/>
  );
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
      <BtnEmoji textareaId={`comment-${post.id}`} />
      <textarea
        id={`comment-${post.id}`}
        placeholder="Adicione um comentário..."
        onChange={e => setCommentTxt(e)}
      />
      <BtnPublish disabled={comment ? false : true}/>
    </form>
  );
}