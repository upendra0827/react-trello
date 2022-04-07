import React, { useEffect, useState } from 'react'
import App from './App'
import Cards from './Cards'
import { getLists } from './Apicalls'
let card_ids = {}
let rendered_cards
let dragItem



const Trello = (props) => {

    // console.log(props.listIds)
    const [card_items, setCardItems] = useState([])
    const [draggables, setDraggables] = useState([])
    const [containers, setContainers] = useState([])

    let identifier
    const submit = (event) => {
        event.preventDefault()
        identifier = event.target.className
        // console.log(identifier)
        let card_value = {
            text: event.target.previousElementSibling.value,
            key: identifier
        }

        fetch(`https://api.trello.com/1/cards?name=${event.target.previousElementSibling.value}&idList=${props.list_ids[identifier]}&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
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
                let parsed_data = JSON.parse(text)
                card_ids[parsed_data['name']] = parsed_data['id']
                // console.log(card_ids)
            })
            .catch(err => console.error(err));


        setCardItems((old_value) => {
            let all_items = [...old_value, card_value]

            return all_items
        })

        event.target.previousElementSibling.value = ''

        return (
            <Cards identifier={identifier} card_value={card_value.text}></Cards>
        )
    }

    
    
        
        draggables.forEach(draggable => {
            
            draggable.addEventListener('dragstart', dragStart)
        })
// 
        // containers.forEach(container => {
            // container.addEventListener('dragover', dragOver);
            // container.addEventListener('dragenter', dragEnter);
            // container.addEventListener('dragleave', dragLeave);
            // container.addEventListener('drop', dragDrop);
        // });

        // function dragOver(e) {
            // e.preventDefault()
            // console.log('drag over');
        // }
        // function dragEnter() {
            // console.log('drag entered');
        // }
        // function dragLeave() {
            // console.log('drag left');
        // }
        // function dragDrop() {
            // console.log('drag dropped');
        // }
                        
                        
        function dragStart(event) {
            
            
            console.log('drag started');
            dragItem = this;
            
            setTimeout(() => this.className = 'invisible', 0)
        }
          


    return (
        <div className='list_block'>
            <article id={props.item}>{props.item}</article>
            <form >
                <input placeholder='ENTER U R CARD' className={props.item}></input>
                <button onClick={submit} className={props.item}>ADD CARD</button>
            </form>
            {
                // GETTING THE CARDS 

                useEffect(() => {
                    async function addCard() {
                        let data = await fetch(`https://api.trello.com/1/lists/${props.list_ids[props.item]}/cards?key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
                            method: 'GET'
                        })
                        return data.json()
                    }
                    addCard()
                        .then(data => {
                            let cardArray = []
                            data.forEach(val => {
                                cardArray.push({
                                    text: val.name,
                                    key: val.id
                                })
                                card_ids[val.name] = val.id

                                setCardItems(cardArray)
                            })
                        })
                }, [])
            }


            <div className='store'>
                {
                    card_items.map((item) => {

                        fetch(`https://api.trello.com/1/lists?name=${item}&idBoard=6249790f0dbab373b9c7471f&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
                            method: 'POST'
                        })
                            .then(response => {
                                console.log(`Response: ${response.status} ${response.statusText}`);
                                return response.text();
                            })
                            .then(data => {
                            })
                            .catch(err => console.error(err));

                        return (
                            <Cards 
                            item={item.text} 
                            card_ids={card_ids}
                            list_ids={props.list_ids}></Cards>
                        )
                    })
                }
            </div>
            <button className={props.item} onClick={props.remove}> DELETE LIST</button>
        </div>
    )
}
export { Trello }

export default Trello