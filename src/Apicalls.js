import { useState } from "react"
import Trello from "./Trello"


const id_board = '624ba231e612e5663b5652e6'
const key = '331ddb3a59a2069f710885250382aa50'
const token = '4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8'


let rendered_cards_array

export function getLists(setItems, list_ids) {
    fetch(`https://api.trello.com/1/boards/624ba231e612e5663b5652e6?lists=open&cards=visible&key=331ddb3a59a2069f710885250382aa50&token=4721efe01374233163a1a836929f7f8add45d6993a745d43894d36b1bee6c0b8`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.json();
        })
        .then(data => {
            let rendered_lists = data.lists.map(item => {
                list_ids[item['name']] = item['id']
                return item['name']})
            setItems(rendered_lists)
            // rendered_cards_array = data.cards.map(item => {
                // return {
                    // text: item['name'],
                    // key: item['id']
                // }
            // })
        })

}