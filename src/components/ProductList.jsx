import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Navbar";
import { addToCart } from "../redux/CartSlice";

const PLANTS_BY_CATEGORY = {
  "Air Purifying": [
    {
      id: "ap-1",
      name: "Snake Plant",
      price: 25,
      image:
        "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ap-2",
      name: "Peace Lily",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ap-3",
      name: "Areca Palm",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1614594851650-7dd8d5d62129?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ap-4",
      name: "Aloe Vera",
      price: 18,
      image:
        "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ap-5",
      name: "Spider Plant",
      price: 20,
      image:
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "ap-6",
      name: "Boston Fern",
      price: 24,
      image:
        "https://images.unsplash.com/photo-1632207691143-643e2f5b8fa7?auto=format&fit=crop&w=600&q=80"
    }
  ],
  Succulents: [
    {
      id: "su-1",
      name: "Echeveria",
      price: 14,
      image:
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "su-2",
      name: "Jade Plant",
      price: 16,
      image:
        "https://images.unsplash.com/photo-1627308595189-7830a5c91f9f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "su-3",
      name: "Zebra Haworthia",
      price: 13,
      image:
        "https://images.unsplash.com/photo-1463154545680-d59320fd685d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "su-4",
      name: "Burro's Tail",
      price: 17,
      image:
        "https://images.unsplash.com/photo-1611211232932-da3113c5b960?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "su-5",
      name: "Panda Plant",
      price: 15,
      image:
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "su-6",
      name: "String of Pearls",
      price: 19,
      image:
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
    }
  ],
  "Pet Friendly": [
    {
      id: "pf-1",
      name: "Calathea Orbifolia",
      price: 32,
      image:
        "https://images.unsplash.com/photo-1593691509543-c55fb32e8b67?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pf-2",
      name: "Parlor Palm",
      price: 26,
      image:
        "https://images.unsplash.com/photo-1632325255175-0c519f8bd9ce?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pf-3",
      name: "Peperomia",
      price: 22,
      image:
        "https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pf-4",
      name: "Prayer Plant",
      price: 24,
      image:
        "https://images.unsplash.com/photo-1622383563242-1d12f90e1a5d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pf-5",
      name: "Rattlesnake Plant",
      price: 28,
      image:
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pf-6",
      name: "African Violet",
      price: 18,
      image:
        "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=600&q=80"
    }
  ]
};

export default function ProductList() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <main className="page-shell">
      <Navbar />

      <section className="product-page">
        <h2>Our Plants</h2>

        {Object.entries(PLANTS_BY_CATEGORY).map(([category, plants]) => (
          <div key={category} className="category-block">
            <h3>{category}</h3>

            <div className="plant-grid">
              {plants.map((plant) => {
                const isAdded = Boolean(cartItems[plant.id]);

                return (
                  <article className="plant-card" key={plant.id}>
                    <img src={plant.image} alt={plant.name} />
                    <h4>{plant.name}</h4>
                    <p>${plant.price.toFixed(2)}</p>
                    <button
                      type="button"
                      disabled={isAdded}
                      onClick={() => dispatch(addToCart(plant))}
                    >
                      {isAdded ? "Added" : "Add to Cart"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}