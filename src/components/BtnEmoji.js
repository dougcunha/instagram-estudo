import '../popup.css'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { useState } from 'react';

export function BtnEmoji({textareaId}) {
  const [show, setShow] = useState(false);
  function showEmojis(e) {
    e.preventDefault();
    setShow(!show);
  }

  function onSelect(emoji) {
    const textarea = document.getElementById(textareaId);
    textarea?.focus();
    textarea?.setRangeText(
      emoji,
      textarea?.selectionStart,
      textarea?.selectionEnd,
      'preserve'
    );

    const pos = textarea?.selectionStart + emoji.length;
    textarea?.setSelectionRange(pos, pos)
  }

  return (
    <div>
      <button className='btn-emoji-list material-icons-outlined' onClick={e => showEmojis(e)}>
        emoji_emotions
      </button>
      <div className='popup'>
        <span className={`popuptext ${show ? 'show' : ''}`} id="popup">
          <Picker native={true} onSelect={e => onSelect(e.native)}/>
        </span>
      </div>
    </div>
  )
}