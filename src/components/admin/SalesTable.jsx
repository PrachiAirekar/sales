// import { isValidDateValue } from '@testing-library/user-event/dist/utils';
import axios from 'axios';
import React, { useEffect, useState,} from 'react'
import { useNavigate } from 'react-router';


export default function SalesTable() {

    let navigate =useNavigate();
    const [SaleData, setSaleData] = useState([]);
    const[rows,setRows]= useState([]);
    const[date, setDate]= useState('');
    const[customerName,setCustomerName] = useState([]);
    const[mobileNumber,setMobileNumber] = useState([]);
    const[errors,setErrors]= useState([]);
    // const [rows, setrows] = useState([]);
    
    // Load sale data from the API
    function loadData() {
        axios.get("https://668e3bf9bf9912d4c92d57a7.mockapi.io/sales/")
            .then((res) => {
                // console.log(res.data);
                setSaleData(res.data)
            });
    }

   // Handle change when product is selected
    function handleChange(productId, rowindex) {
        let updateRows= rows.map((row, i) => {
            if (i === rowindex) {
                let price = 0
                let gst = 0
                let subtotal = 0
                for (let j = 0; j < SaleData.length; j++) {
                    if (SaleData[j].id === productId) {
                        price = SaleData[j].price;
                        gst = SaleData[j].gst * row.quantity;
                        subtotal =((price * row.quantity) + (price * row.quantity)/100 * gst) ;


                    }

                }
                // console.log(price);
                return { ...row, price, gst, subtotal };
            }
            return row;
        });

        setRows(updateRows);

    }
    // add a new row 
    const addRow = () => {
        let copyrows = [...rows]
        copyrows.push({ productId: 0, price: 0, quantity: 1, gst: 0, subtotal: 0 })
        setRows(copyrows)
        console.log(rows);
    }
     // Handle quantity change
    function quantityChange(quantity, rowindex) {
        let updateRows = rows.map((row, index) => {
            if (index === rowindex) {
                let price = row.price
                let gst = row.gst
                let subtotal =((price * quantity)+(price * quantity)/ 100  * gst )
                return { ...row, subtotal, quantity };
            }
            return row;
        });
        setRows(updateRows)
    }
    function removerow(e, id) {
        e.preventDefault ();
        const updatedRows = rows.filter(row => row.productId !== id);
        setRows(updatedRows);
        };
          
        // Calculate totals (price, GST, and subtotal)
        const  calculateTotal =()=>{
            let totalPrice = 0;
            let totalGst =0;
            let overallSubtotal=0;
        
            rows.forEach(row=> {
                const price = parseFloat(row.price);
                const gst =parseFloat(row.gst);
                const quantity=parseFloat(row.quantity);
                const subtotal= parseFloat(row.subtotal);

                if(!isNaN(subtotal)){
                    totalPrice += price* quantity;
                    totalGst += gst;
                    overallSubtotal+= subtotal;
        
                }
            });
            return{
                totalPrice: totalPrice.toFixed(2),
                totalGst:totalGst.toFixed(2),
                overallSubtotal:overallSubtotal.toFixed(2),
            };
        };
      const validateFrom =()=>{
      const newErrors ={};

    //   From Level validation
    if(!date) newErrors.data = "Date is requried.";
    if(!customerName)newErrors.customerName ="Customer name is requried.";
    if(!mobileNumber || !/^\d{10}$/.test(mobileNumber)){
        newErrors.mobileNumber = "Valid mobile number is required (10 digits).";
    }
    // Row- level validtaion 
    const invalidRows = rows.map((row,index)=>{
        if(!row.productId|| row.quantity <=0){
            return{index,error : "product and quantity are requried."}
        }
        return null;
    }).filter(row => row!==null);
    
     if (invalidRows.length > 0){
        newErrors.rows = invalidRows;
     }
     setErrors(newErrors);
     return Object.keys(newErrors).length===0; //Return true if no errors
  };
    // handle from a  submission 
     function handleSubmit(){
         
        // proceed if validation passes
        const selectedproducts = rows.map(row =>{
             
            return{
                productId:row.productId,
                price:row.price,
                quantity:row.quantity,
                gst:row.gst,
                subtotal:row.subtotal,
            };
        });
        //   Get the totals from calculateTotal function
        const totals = calculateTotal();

        const orderData ={
           date,
           customerName,
           mobileNumber,
           totalPrice:totals.totalPrice,
           totalGSt:totals.totalGst,
           overallSubtotal:totals.overallSubtotal,
           products:selectedproducts,
        };
           
         // Log the collected data
         console.log(orderData);
         axios.post("https://668e3bf9bf9912d4c92d57a7.mockapi.io/orders",orderData)
             .then((res) => {
                 console.log(res.data);
                 navigate("/admin/salesexpensedata")
             })
             .catch((error) => {
                 console.error("Error submitting the data:", error);
             });
     };


    // Load Sale Data on component mount
    useEffect(() => {
        loadData();
    } , []);
      

   return (
    <div>
       <div style={{marginTop: "58px"}}>
        <div class="container pt-4">
            <div class="">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-4 mb-3"><label for="date" class="form-label">Date:</label>
                                       <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                            <div class="col-lg-4 mb-3">
                                  <label for="customerName" class="form-label">Customer Name:</label>
                                    <input type="text" class="form-control" id="customerName"onChange={(e) => setCustomerName(e.target.value)} />
                            </div>
                            <div class="col-lg-4 mb-3"><label for="mobileNumber" class="form-label">Mobile Number:</label>
                                    <input type="tel" class="form-control" id="mobileNumber"onChange={(e)=>setMobileNumber(e.target.value)}/>
                            </div>
                        </div>
                        <button class="btn btn-primary mb-3" onClick={addRow}>Add Row</button>
                    </div>
                </div>
                <div class="card mt-1">
                    <div class="card-body">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>GST</th>
                                    <th>Subtotal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                            rows.map((row, index) => {
                                                // console.log(row);
                                                return (
                                                    <tr key={index}>

                                                        <td>
                                                            <select onChange={(e) => handleChange(e.target.value, index)} class="form-select">
                                                                <option value="" disabled="">Select a product</option>
                                                                    {SaleData.map((sale) => (
                                                                        <option key={sale.id} value={sale.id}>{sale.product}</option>
                                                                    ))}
                                                            </select>
                                                        </td>
                                                        <td>{row.price}/-</td>
                                                        <td><input type="number" class="form-control" min="1"value={row.quantity} onChange={(e) => quantityChange(e.target.value, index)} /></td>
                                                        <td>{parseFloat(row.gst) * parseFloat(row.quantity)}% </td>
                                                        <td>{(parseFloat(row.price) * parseFloat(row.quantity)) + (parseFloat(row.price) * parseFloat(row.quantity) / 100 * row.gst)}</td>
                                                        <td><button onClick={(e)=> removerow(e, row.id)} class="btn btn-danger">Remove</button></td>
                                                    </tr>
                                                )
                                            })}
                            </tbody>
                        </table>
                        <hr/>
                        <div class="mt-5">
                            <h4>Total Price: {calculateTotal().totalPrice}</h4>
                            <h4>Total GST:{ calculateTotal().totalGst}</h4>
                            <h4>Overall Subtotal:{ calculateTotal().overallSubtotal}</h4>
                        </div>
                        <div className="col-lg-12 d-flex justify-content-end">
                                    <button onClick={handleSubmit} className="btn btn-success">
                                        Submit Data
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}
