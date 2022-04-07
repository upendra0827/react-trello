import React, { useState, useEffect } from 'react'
import Checklist from './Checklist'

const Description = (props) => {
  const [addDesc, setAddDesc] = useState(false)
  const [descPara, setDescPara] = useState('add description')
  const [comments, setComments] = useState('')
  const [storeComments, setStoreComments] = useState([])
  const [checkList, setCheckList] = useState(false)
  let card_name = props.name_of_card

  // console.log(card_name)
  // console.log(props.card_ids)
  const add_the_description = (event) => {
    // console.log(props.name_of_card_for_description)

    let desc_value = document.querySelector('.desc_data').innerText
    setAddDesc(false)
    setDescPara(desc_value)

    fetch(`https://api.trello.com/1/cards/${props.card_ids[event.target.className]}?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8&desc=${desc_value}`, {
      method: 'PUT'
    })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .then(data => {
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetch(`https://api.trello.com/1/cards/${props.card_ids[card_name]}?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
      method: 'GET'
    })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        console.log(data['desc'])
        setDescPara(data['desc'])
      })
      .catch(err => console.error(err));
  })

  const add_comment = (event) => {
    setComments(event.target.value)

  }

  const submit = (event) => {
    event.preventDefault()
    fetch(`https://api.trello.com/1/cards/${props.card_ids[event.target.className]}/actions/comments?text=${comments}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {

      method: 'POST'
    })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .then(data => {
      })
      .catch(err => console.error(err));

    setStoreComments((old_comments) => {
      let all_comments = [...old_comments, comments]
      return all_comments
    })
  }

  useEffect(() => {
    fetch(`https://api.trello.com/1/cards/${props.card_ids[card_name]}/actions?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
      method: 'GET'
    })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.json();
      })
      .then(data => {
        let comments_array = []
        data.map(info => {
          comments_array.push(info.data.text)
        })

        setStoreComments(comments_array)
      })
      .catch(err => console.error(err));

      

  }, [])


  if (!props.descriptionBox) return
  return (
    <div className='pop_up'>


      <div className='desc_comments'>
        <div>
          <button onClick={() => { props.setDescriptionBox(false) }} className='desc_close'>x</button>
        </div>
        <div>
          <div className='desc_data_box'>
            <p onClick={() => setAddDesc(true)} style={{ background: addDesc ? 'gray' : 'white' }} contentEditable={addDesc ? true : false} className='desc_data'> {descPara} </p>
            <button onClick={add_the_description} className={props.name_of_card_for_description}>SAVE</button>
          </div>
        </div>
        <div>
          <p onClick={() => { setCheckList(true) }} className='checklists'>CHECKLISTS</p>
          <Checklist checkList={checkList} setCheckList={setCheckList} name_of_card={props.name_of_card_for_description} card_ids={props.card_ids} card_name={card_name}></Checklist>
        </div>
        <div>
          <section className='comments'>
            {
              storeComments.map(item => {
                return (
                  <li>{item}</li>

                )
              })
            }
          </section>

          <form>
            <input placeholder='ADD COMMENTS' value={comments} onChange={add_comment}></input>
            <button onClick={submit} className={props.name_of_card_for_description}>ADD</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Description
