
import './App.css';
import React, { useEffect, useState } from 'react'
import Trello from './Trello';
import get_card from './Trello'
import Cards from './Cards';
import act from './Trello'
import { getLists} from './Apicalls'

let index
let list_ids = {}
let cards_after_reload
let list_ids_array = []
let rendered_cards_array

function App(props) {
  console.log(props)
  // act()

  let data
  const [items, setItems] = useState([])
  const [itemsAfterRender, setItemsAfterRender] = useState([])
  const [listIds, setListIds] = useState([])

  const submit = e => {
    e.preventDefault()
    let data = document.getElementById('input').value
    console.log(data)
    // POSTING LISTS IN TRELLO 

    fetch(`https://api.trello.com/1/lists?name=${data}&idBoard=624ba231e612e5663b5652e6&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
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
        let list_data = JSON.parse(text)
        list_ids[list_data['name']] = list_data['id']


      })
      .catch(err => console.error(err));



    setItems((old_value) => {
      let all_items = [...old_value, data]

      return all_items
    })
    document.getElementById('input').value = ''

  }

  const remove = (event) => {
    event.target.parentNode.remove()
    let id_of_list_to_remove = list_ids[event.target.parentNode.firstChild.innerText]
    fetch(`https://api.trello.com/1/lists/${id_of_list_to_remove}/closed?value=true&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
      method: 'PUT'
    })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .catch(err => console.error(err));
  }

  useEffect(() => {
    
    getLists(setItems, list_ids)
    
  }, [])

  return (
    <div className="App">
      <div className='input_form'>

        <form>
          <input id='input' placeholder='ENTER U R LIST'></input>
          <button onClick={submit}>ADD</button>
        </form>
      </div>


      <section className='list_store'>
        {
          items.map((item, index) => {
           

              return (
                <Trello  item={item} id={index} key={index} remove={remove} listIds={listIds}  cards_after_reload={cards_after_reload} list_ids={list_ids} rendered_cards_array={rendered_cards_array} setItems={props.setItems}><Cards /></Trello>
              
                )
              
          })

        }

      </section>
    </div>
  );
}

export default App;
