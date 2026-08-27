import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : { items: [] }
  } catch {
    return { items: [] }
  }
}

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, size } = action.payload
      const existingItem = state.items.find(
        item => item.product === product._id && item.size === size
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          price: product.effectivePrice || product.price,
          image: product.images[0]?.url,
          quantity,
          size,
          stockQuantity: product.stockQuantity,
        })
      }
      saveCartToStorage(state)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => !(item.product === action.payload.productId && item.size === action.payload.size)
      )
      saveCartToStorage(state)
    },
    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload
      const item = state.items.find(
        item => item.product === productId && item.size === size
      )
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stockQuantity))
      }
      saveCartToStorage(state)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer