"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {

  const [rows, setRows] = useState([
    { name: "", price: "", total: "", used: "", cost: 0 }
  ]);

  function update(index:number, field:string, value:string){
    const newRows:any = [...rows];
    newRows[index][field] = value;

    const price = Number(newRows[index].price);
    const total = Number(newRows[index].total);
    const used = Number(newRows[index].used);

    if(price && total && used){
      newRows[index].cost = (price / total) * used;
    }

    setRows(newRows);
  }

  function addRow(){
    setRows([
      ...rows,
      { name:"", price:"", total:"", used:"", cost:0 }
    ]);
  }

  function deleteRow(index:number){
    const newRows = rows.filter((_,i)=> i !== index);
    setRows(newRows);
  }

  function totalCost(){
    return rows.reduce((sum,r)=> sum + Number(r.cost),0);
  }

  // 📱 CSV (fallback)
  function exportCSV(){

    const header = ["Ingredient","Price","Total g","Used g","Cost"];

    const rowsData = rows.map(r => [
      r.name,
      r.price,
      r.total,
      r.used,
      r.cost.toFixed(2)
    ]);

    const csvContent =
      [header, ...rowsData]
        .map(e => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    window.open(url);
  }

  // 💻 Excel (ลองก่อน)
  function exportExcel(){

    try {

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Cost");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "ingredient_cost.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      exportCSV(); // fallback
    }
  }

  function handleExport(){
    exportExcel(); // 🔥 ใช้ Excel ก่อน
  }
  async function handleImport(e:any){

  const file = e.target.files[0];
  if(!file) return;

  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const json:any = XLSX.utils.sheet_to_json(worksheet);

  const formatted = json.map((r:any)=>{

    const price = Number(r.price || r.Price);
    const total = Number(r.total || r["Total g"]);
    const used = Number(r.used || r["Used g"]);

    return {
      name: r.name || r.Ingredient || "",
      price: price || "",
      total: total || "",
      used: used || "",
      cost: price && total && used ? (price/total)*used : 0
    };

  });

  setRows(formatted);
}

  return (

<div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12 px-4">

<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
Ingredient Cost Calculator
</h1>

<div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-4 sm:p-8">

{/* DESKTOP */}

<div className="hidden md:block">

<table className="w-full text-left">

<thead>
<tr className="bg-gray-200 text-gray-700">
<th className="p-4">Ingredient</th>
<th className="p-4">Price</th>
<th className="p-4">Total g</th>
<th className="p-4">Used g</th>
<th className="p-4 text-right">Cost</th>
<th className="p-4"></th>
</tr>
</thead>

<tbody>

{rows.map((row,i)=>(
<tr key={i} className="border-b">

<td className="p-3">
<div className="flex items-center gap-3">
<span className="text-gray-500 w-14">No.{i+1}</span>
<input
className="border rounded px-3 py-2 w-full"
value={row.name}
onChange={(e)=>update(i,"name",e.target.value)}
/>
</div>
</td>

<td className="p-3">
<input type="number" className="border rounded px-3 py-2 w-full"
value={row.price}
onChange={(e)=>update(i,"price",e.target.value)}
/>
</td>

<td className="p-3">
<input type="number" className="border rounded px-3 py-2 w-full"
value={row.total}
onChange={(e)=>update(i,"total",e.target.value)}
/>
</td>

<td className="p-3">
<input type="number" className="border rounded px-3 py-2 w-full"
value={row.used}
onChange={(e)=>update(i,"used",e.target.value)}
/>
</td>

<td className="p-3 text-right font-bold text-green-700">
{row.cost.toFixed(2)} ฿
</td>

<td className="p-3">
<button onClick={()=>deleteRow(i)}
className="bg-red-500 text-white px-3 py-2 rounded">
🗑
</button>
</td>

</tr>
))}

</tbody>
</table>

</div>

{/* MOBILE */}

<div className="md:hidden space-y-4">

{rows.map((row,i)=>(

<div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-3">

<p className="text-gray-500">No.{i+1}</p>

<input className="border rounded px-3 py-2 w-full"
placeholder="Ingredient"
value={row.name}
onChange={(e)=>update(i,"name",e.target.value)}
/>

<input type="number" className="border rounded px-3 py-2 w-full"
placeholder="Price"
value={row.price}
onChange={(e)=>update(i,"price",e.target.value)}
/>

<input type="number" className="border rounded px-3 py-2 w-full"
placeholder="Total g"
value={row.total}
onChange={(e)=>update(i,"total",e.target.value)}
/>

<input type="number" className="border rounded px-3 py-2 w-full"
placeholder="Used g"
value={row.used}
onChange={(e)=>update(i,"used",e.target.value)}
/>

<div className="flex justify-between items-center">

<p className="font-bold text-green-700 text-lg">
{row.cost.toFixed(2)} ฿
</p>

<button onClick={()=>deleteRow(i)}
className="bg-red-500 text-white px-3 py-2 rounded">
Delete
</button>

</div>

</div>

))}

</div>

{/* BOTTOM */}

<div className="mt-8 w-full">

{/* TOTAL */}
<div className="mb-6 text-center sm:text-left">
<p className="text-gray-500 text-sm">Total Cost</p>
<p className="text-2xl sm:text-3xl font-bold text-green-700">
{totalCost().toFixed(2)} ฿
</p>
</div>

{/* DESKTOP BUTTONS */}
<div className="hidden sm:flex gap-3">

<button
onClick={addRow}
className="bg-orange-500 text-white px-6 py-2 rounded">
+ Add Ingredient
</button>

<button
onClick={handleExport}
className="bg-green-600 text-white px-6 py-2 rounded">
Download File
</button>

<label className="bg-blue-500 text-white px-6 py-2 rounded cursor-pointer">
Import Excel
<input
  type="file"
  accept=".xlsx, .xls"
  onChange={handleImport}
  className="hidden"
/>
</label>

</div>

{/* MOBILE BUTTONS */}
<div className="sm:hidden flex flex-col gap-3 w-full">

<button
onClick={addRow}
className="bg-orange-500 text-white px-6 py-3 rounded-lg w-full">
+ Add Ingredient
</button>

<button
onClick={handleExport}
className="bg-green-600 text-white px-6 py-3 rounded-lg w-full">
Download File
</button>

<label className="bg-blue-500 text-white px-6 py-3 rounded-lg text-center cursor-pointer w-full">
Import Excel
<input
  type="file"
  accept=".xlsx, .xls"
  onChange={handleImport}
  className="hidden"
/>
</label>

</div>

</div>



</div>

</div>

  );
}