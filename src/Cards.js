import React, { useState } from 'react'
import Trello from './Trello'
import Description from './Description'
let name_of_card_for_description
let drag_item
let drag_item_id
let receiver_list_id

const Cards = (props) => {
  const [descriptionBox, setDescriptionBox] = useState(false)

  console.log(props)

  const change = (event) => {
    name_of_card_for_description = event.target.innerText
    setDescriptionBox(true)
  }

  const drag_start = (event) => {
    drag_item = event.target
    drag_item_id = props.card_ids[event.target.innerText]
  }

  const drag_enter = () => {
    console.log('drag enter')
  }

  const drag_over = (event) => {
    event.preventDefault()
    console.log('drag over')
  }


  const drag_drop = (event) => {
    event.target.parentNode.append(drag_item)
    receiver_list_id = props.list_ids[event.target.parentNode.parentNode.parentNode.previousElementSibling.previousElementSibling.innerText]

    fetch(`https://api.trello.com/1/cards/${drag_item_id}?pos=bottom&idList=${receiver_list_id}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`)
        return response.text();
      })
      .then(text => console.log(text))
      .catch(err => console.error(err));
  }

  return (
    <div onDrop={drag_drop}>
      <div>
        <li className={props.identifier} onClick={change}
          draggable={true}
          onDragStart={drag_start}
          onDragEnter={drag_enter}
          onDragOver={drag_over}
        // onDrop={drag_drop}
        >{props.item}</li>
      </div>

      <Description descriptionBox={descriptionBox} setDescriptionBox={setDescriptionBox} card_ids={props.card_ids} name_of_card_for_description={name_of_card_for_description} name_of_card={props.item}></Description>

    </div>
  )
}

export default Cards
