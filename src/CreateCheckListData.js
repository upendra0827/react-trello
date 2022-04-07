import React, { useEffect, useState } from 'react'
import CheckItem from './CheckItem'
let name_of_checklist_to_postitem
let check_items_ids = {}

const CreateCheckListData = (props) => {
    // console.log(props.name_of_card)
    console.log(props.check_list_ids)
    console.log(props.item)
    const [checkItem, setCheckItem] = useState([])
    const [checkBox, setCheckBox] = useState(false)
    const [checkItemComelete, setCheckItemComplete] = useState(false)
    const [checkItemStatus, setCheckItemStatus] = useState('complete')


    const complete_check_list = (event) => {
        checkBox ? setCheckBox(false) : setCheckBox(true)
        checkBox ? setCheckItemStatus('complete') : setCheckItemStatus('incomplete')
        console.log(checkBox)
        console.log(checkItemStatus)

        fetch(`https://api.trello.com/1/cards/${props.card_ids[event.target.className]}/checklist/${props.check_list_ids[event.target.nextElementSibling.className]}/checkItem/${check_items_ids[event.target.nextElementSibling.innerText]}?state=${checkItemStatus}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
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
            // .then(text => console.log(document.querySelector(`.${identifier}`).valuee.log(text)))
            .catch(err => console.error(err));
    }

    const delete_checklist = (event) => {

        let belong_card_name = event.target.getAttribute('belong_card_name')
        let check_list_name = event.target.getAttribute('check_list_name')

        fetch(`https://api.trello.com/1/cards/${props.card_ids[belong_card_name]}/checklists/${props.check_list_ids[check_list_name]}?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`,{
            method: 'DELETE'
        })
          .then(response => {
            console.log(
              `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
          })
          .then(text => console.log(text))
          .catch(err => console.error(err));

          event.target.parentNode.remove()       

    }


    useEffect(() => {
        fetch(`https://api.trello.com/1/checklists/${props.check_list_ids[props.item]}/checkItems?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
            method: 'GET'
        })
            .then(response => {
                console.log(
                    `Response: ${response.status} ${response.statusText}`
                );
                return response.json();
            })
            .then(text => {
                let check_items_array = text.map(each_item => {
                    check_items_ids[each_item['name']] = each_item['id']
                    return each_item['name']
                })
                setCheckItem(check_items_array)
            })
            .catch(err => console.error(err));
    }, [])


    const add_check_item = (event) => {
        event.preventDefault()
        
        let item = event.target.previousElementSibling.value
        name_of_checklist_to_postitem = event.target.className
        console.log(name_of_checklist_to_postitem)
        console.log(props.check_list_ids[name_of_checklist_to_postitem])
        event.target.previousElementSibling.value = ''

        setCheckItem(old_values => {
            let all_value = [...old_values, item]
            return all_value
        })

        fetch(`https://api.trello.com/1/checklists/${props.check_list_ids[name_of_checklist_to_postitem]}/checkItems?name=${item}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {

            method: 'POST'
        })
            .then(response => {
                console.log(`Response: ${response.status} ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                let parsed_data = JSON.parse(data)
                check_items_ids[parsed_data['name']] = parsed_data['id']
                console.log(check_items_ids)
            })
            .catch(err => console.error(err));

    }


    return (
        <div className='check_list_name'>
            <div >{props.item}</div>
            <div>
                {
                    checkItem.map(item => {
                        return (
                            <div className='check_item_box'>
                                {/* <input type='checkbox' onClick={complete_check_list} className={props.name_of_card}></input> */}
                                {/* <div style={{ textDecoration: checkBox ? 'line-through' : 'none' }} className={props.item}>{item}</div> */}

                                <CheckItem 
                                item={props.item} name_of_item={item} 
                                checkBox={checkBox} 
                                complete_check_list={complete_check_list} 
                                card_ids={props.card_ids} 
                                check_list_ids={props.check_list_ids} 
                                check_items_ids={check_items_ids}
                                name_of_card={props.name_of_card}
                                ></CheckItem>
                            </div>
                        )
                    })
                }

            </div>
            <button className='delete' onClick={delete_checklist} check_list_name={props.item} belong_card_name={props.name_of_card}>DELETE</button>
            <form className='check_item'>
                <input placeholder='add u r checkitem' className='check_item_value'></input>
                <button onClick={add_check_item} className={props.item}>add</button>
            </form>
        </div>
    )
}

export default CreateCheckListData
