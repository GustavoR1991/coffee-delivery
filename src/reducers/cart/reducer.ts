import { produce } from "immer";
// Importa a função 'produce' do Immer, que permite manipular o estado de forma imutável

import { ActionTypes, type Actions } from "./action";
// Importa os tipos de ação e o enum com os tipos disponíveis (ADD_ITEM, REMOVE_ITEM, etc.)

import type { OrderInfo } from "../../pages/Cart";
// Importa o tipo das informações do pedido

// Representa um item no carrinho
export interface Item {
  id: string;
  quantity: number;
}

// Representa um pedido finalizado, que inclui os dados do OrderInfo + id e itens
export interface Order extends OrderInfo {
  id: number;
  items: Item[];
}

// Estado do carrinho: lista de itens no carrinho + lista de pedidos feitos
interface CartState {
  cart: Item[];
  orders: Order[];
}

// Função que gerencia as mudanças no estado com base na ação recebida
export function cartReducer(state: CartState, action: Actions) {
  switch (action.type) {
    // Adiciona um item ao carrinho ou atualiza a quantidade se já existir
    case ActionTypes.ADD_ITEM:
      return produce(state, (draft) => {
        const itemAlreadyAdded = draft.cart.find(
          (item) => item.id === action.payload.item.id
        );

        if (itemAlreadyAdded) {
          // Se o item já existe no carrinho, só incrementa a quantidade
          itemAlreadyAdded.quantity += action.payload.item.quantity;
        } else {
          // Se não existe, adiciona o item ao carrinho
          draft.cart.push(action.payload.item);
        }
      });

    // Remove um item do carrinho pelo ID
    case ActionTypes.REMOVE_ITEM:
      return produce(state, (draft) => {
        const itemToRemoveId = draft.cart.findIndex(
          (item) => item.id === action.payload.itemId
        );

        draft.cart.splice(itemToRemoveId);
      });

    // Incrementa a quantidade de um item no carrinho
    case ActionTypes.INCREMENT_ITEM_QUANTITY:
      return produce(state, (draft) => {
        const itemToIncrement = draft.cart.find(
          (item) => item.id === action.payload.itemId
        );
        if (itemToIncrement?.id) {
          itemToIncrement.quantity += 1;
        }
      });

    // Decrementa a quantidade de um item no carrinho (mínimo de 1)
    case ActionTypes.DECREMENT_ITEM_QUANTITY:
      return produce(state, (draft) => {
        const itemToDecrement = draft.cart.find(
          (item) => item.id === action.payload.itemId
        );
        if (itemToDecrement?.id && itemToDecrement.quantity > 1) {
          itemToDecrement.quantity -= 1;
        }
      });

    // Finaliza a compra (checkout)
    case ActionTypes.CHECKOUT_CART:
      return produce(state, (draft) => {
        const newOrder = {
          id: new Date().getTime(), // Gera um ID único com base no timestamp
          items: state.cart, // Copia os itens do carrinho atual
          ...action.payload.order, // Junta com as infos do formulário (endereço, pagamento, etc.)
        };

        draft.orders.push(newOrder); // Adiciona o novo pedido à lista de pedidos
        draft.cart = []; // Limpa o carrinho
        action.payload.callback(`/order/${newOrder.id}/success`);
        // Redireciona o usuário para a página de sucesso do pedido
      });

    // Caso não reconheça a ação, retorna o estado sem alterações
    default:
      return state;
  }
}
