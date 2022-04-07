import React, { useEffect, useState } from 'react'
import CreateCheckListData from './CreateCheckListData'
let id_of_card_for_check_list
let check_list_ids = {}
let check_list_data

const Checklist = (props) => {

  const [checkListInfo, setCheckListInfo] = useState([])


  const add_checklist = (event) => {
    event.preventDefault()
    
    id_of_card_for_check_list = (props.card_ids[event.target.className])
    check_list_data = document.querySelector('.input_of_checklist').value
    document.querySelector('.input_of_checklist').value = ''
    

    setCheckListInfo(old_items => {

      let all_items = [...old_items, check_list_data]
      return all_items
    })


    // ADDING CHECKLISTS

    fetch(`https://api.trello.com/1/cards/${id_of_card_for_check_list}/checklists?name=${check_list_data}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
      method: 'POST',
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
      .then(text => {
        let data = JSON.parse(text)
        check_list_ids[check_list_data] = data['id']
        // console.log(check_list_ids)
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    async function gettingChecklists() {
      let response = await fetch(`https://api.trello.com/1/cards/${props.card_ids[props.card_name]}/checklists?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
        method: 'GET'
      })
      return response.json();
    }
    gettingChecklists()
    .then(data => {
      let check_lists_array = data.map(item => {
        check_list_ids[item['name']] = item['id']
        return item['name']
      })
      setCheckListInfo(check_lists_array)
    } )
  }, [])

  if (!props.checkList) return
  return (
    <div>
      <div className='close_check_list'>

      <button onClick={() => { props.setCheckList(false) }} >X</button>
      </div>
      <div>
      <article>
        {
          checkListInfo.map(item => {
            return (
              <CreateCheckListData item={item} card_ids={props.card_ids} check_list_ids={check_list_ids} name_of_card={props.name_of_card}></CreateCheckListData>
            )
          })
        }
      </article>
      </div>
      <form>
        <input className='input_of_checklist' placeholder='write u r checklist'></input>
        <button onClick={add_checklist} className={props.name_of_card}>ADD</button>
      </form>
    </div>

  )
}

export default Checklist
