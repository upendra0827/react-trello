import React, { useState } from 'react'

const CheckItem = (props) => {
    const [box, setBox] = useState(false)
    const [itemStatus, setItemStatus] = useState('complete')


    const complete_box = (event) => {
        box ? setBox(false) : setBox(true)
        box ? setItemStatus('complete') : setItemStatus('incomplete')

        fetch(`https://api.trello.com/1/cards/${props.card_ids[event.target.className]}/checklist/${props.check_list_ids[event.target.nextElementSibling.className]}/checkItem/${props.check_items_ids[event.target.nextElementSibling.innerText]}?state=${itemStatus}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                console.log(
                    `Response: ${response.status} ${response.statusText}`
                );
                return response.text();
            })
            .then(text => console.log(text))
            .catch(err => console.error(err));
    }

  return (
    <div>
      <input type='checkbox' onClick={complete_box} className={props.name_of_card}></input>
      <div style={{ textDecoration: box ? 'line-through' : 'none' }} className={props.item}>{props.name_of_item}</div>
    </div>
  )
}

export default CheckItem
