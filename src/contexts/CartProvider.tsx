// Importações necessárias do React e React Router
import { createContext, useEffect, useReducer, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Tipagem do pedido (OrderInfo) que vem da página do carrinho
import type { OrderInfo } from "../pages/Cart";

// Importa o reducer do carrinho e os tipos necessários
import { cartReducer, type Item, type Order } from "../reducers/cart/reducer";

// Importa as ações que manipulam o estado do carrinho
import {
  addItemAction,
  checkoutCartAction,
  decrementItemQuantityAction,
  incrementItemQuantityAction,
  removeItemAction,
} from "../reducers/cart/action";

// Define o formato dos dados e funções que estarão disponíveis no contexto do carrinho
interface CartContextType {
  cart: Item[]; // Lista de itens no carrinho
  orders: Order[]; // Lista de pedidos finalizados
  addItem: (item: Item) => void; // Adiciona item ao carrinho
  removeItem: (itemId: Item["id"]) => void; // Remove item do carrinho
  decrementItemQuantity: (itemId: Item["id"]) => void; // Diminui quantidade
  incrementItemQuantity: (itemId: Item["id"]) => void; // Aumenta quantidade
  checkout: (order: OrderInfo) => void; // Finaliza o pedido
}

// Cria o contexto com valor inicial como um objeto vazio (será preenchido no Provider)
export const CartContext = createContext({} as CartContextType);

// Tipagem do componente Provider, que aceita filhos (children)
interface CartContextProviderProps {
  children: ReactNode; // Tudo que estiver dentro do Provider
}

// Função que fornece os dados e ações do carrinho para os componentes filhos
export function CartContextProvider({ children }: CartContextProviderProps) {
  // useReducer inicializa o estado com o reducer e estado padrão (cart vazio)
  const [cartState, dispatch] = useReducer(
    cartReducer,
    {
      cart: [],
      orders: [],
    },
    (cartState) => {
      // Tenta recuperar o estado salvo no localStorage
      const storedStateAsJSON = localStorage.getItem(
        "@coffee-delivery:cart-state-1.0.0"
      );
      if (storedStateAsJSON) {
        // Se encontrar, retorna o estado salvo
        return JSON.parse(storedStateAsJSON);
      }
      // Caso contrário, retorna o estado inicial
      return cartState;
    }
  );

  // Hook para redirecionar o usuário após o checkout
  const navigate = useNavigate();

  // Extrai os dados do estado atual (cart e orders)
  const { cart, orders } = cartState;

  // Função para adicionar um item ao carrinho
  function addItem(item: Item) {
    dispatch(addItemAction(item));
  }

  // Função para remover um item pelo ID
  function removeItem(itemId: Item["id"]) {
    dispatch(removeItemAction(itemId));
  }

  // Função para finalizar a compra
  function checkout(order: OrderInfo) {
    dispatch(checkoutCartAction(order, navigate));
  }

  // Função para aumentar a quantidade de um item
  function incrementItemQuantity(itemId: Item["id"]) {
    dispatch(incrementItemQuantityAction(itemId));
  }

  // Função para diminuir a quantidade de um item
  function decrementItemQuantity(itemId: Item["id"]) {
    dispatch(decrementItemQuantityAction(itemId));
  }

  // useEffect para salvar o estado atual no localStorage sempre que o carrinho mudar
  useEffect(() => {
    if (cartState) {
      const stateJSON = JSON.stringify(cartState);
      localStorage.setItem("@coffee-delivery:cart-state-1.0.0", stateJSON);
    }
  }); // (faltou dependência: deveria ser [cartState] para evitar execução desnecessária)

  // Retorna o Provider com os dados e funções do carrinho
  return (
    <CartContext.Provider
      value={{
        addItem,
        cart,
        orders,
        decrementItemQuantity,
        incrementItemQuantity,
        removeItem,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
