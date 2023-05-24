import React from "react"
import {
    Typography
  } from "@mui/material";
  import { Box } from "@mui/system";

const OrderDetails=(items)=>{
  // let totalCost = 0;
   let totalQty = 0;
  
  // items.forEach(item => {
  //   totalCost += item.cost * item.qty;
  //   totalQty += item.qty;
  // });
  const itemsArray = Object.values(items);
  const totalCost = itemsArray.reduce((acc, item) => acc + item.cost, 0);
  console.log(items.items)
    return (
        <div className="cart">
  <Box fontWeight="bold" paddingBottom="1rem" textAlign="left">
    Order Details
  </Box>
  <Box paddingBottom="1rem">
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1">Products</Typography>
      <Typography variant="body1" style={{ textAlign: 'right' }}>{totalQty}</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1">Subtotal</Typography>
      <Typography variant="body1" style={{ textAlign: 'right' }}>{totalCost}</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1">Shipping Charges</Typography>
      <Typography variant="body1" style={{ textAlign: 'right' }}>$O</Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="bold" variant="body1">Total</Typography>
      <Typography fontWeight="bold" variant="body1" style={{ textAlign: 'right' }}>{totalCost}</Typography>
    </Box>
  </Box>
</div>
    )
}

export default OrderDetails;