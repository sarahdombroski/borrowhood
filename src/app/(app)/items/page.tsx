import { getVisibleItems } from "./actions";

export default async function Items() {
  const visibileItems = await getVisibleItems();
  
  return (
    <main>
      <p>Welcome to your full Items list!</p>
      <ul>
        {visibileItems.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </main>
  )
}