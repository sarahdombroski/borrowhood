import Link from "next/link";
import { createItem, getVisibleItems } from "./actions";

export default async function Items() {
  const visibileItems = await getVisibleItems();
  
  return (
    <main>
      <p>Welcome to your full Items page!</p>
      
      <h2>Create an item:</h2>
      <form action={createItem} className="mb-4">
        <input name="name" placeholder="Name" required className="mr-3 w-3/4" />
        <button type="submit">Create item</button>
      </form>

      <ul>
        {visibileItems.map((item) => (
          <li key={item.name}><Link href={`/items/${item.id}`}>{item.name}</Link></li>
        ))}
      </ul>
    </main>
  )
}