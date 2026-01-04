import { useMemo, useState } from "react";
import "./App.css";

const initialVenues = [
  {
    id: crypto.randomUUID(),
    name: "Atrévete Torremolinos",
    address: "Calle Salvador Allende 10, Málaga, España",
    imageUrl: "",
    instagramUrl: "https://www.instagram.com/",
    city: "Torremolinos",
    country: "España",
    isFavorite: false,
  },
];

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function App() {
  const [venues, setVenues] = useState(initialVenues);

  // UI state
  const [search, setSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // form state
  const [form, setForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    instagramUrl: "",
    city: "",
    country: "",
  });

  const filteredVenues = useMemo(() => {
    const q = search.trim().toLowerCase();
    return venues
      .filter((v) => (onlyFavorites ? v.isFavorite : true))
      .filter((v) => {
        if (!q) return true;
        const text = `${v.name} ${v.address} ${v.city ?? ""} ${
          v.country ?? ""
        }`.toLowerCase();
        return text.includes(q);
      });
  }, [venues, search, onlyFavorites]);

  function addVenue(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.address.trim()) {
      alert("Nombre y dirección son obligatorios.");
      return;
    }
    if (form.instagramUrl && !isValidUrl(form.instagramUrl)) {
      alert("El link de Instagram no es una URL válida.");
      return;
    }
    if (form.imageUrl && !isValidUrl(form.imageUrl)) {
      alert("La imagen debe ser una URL válida (por ahora).");
      return;
    }

    const newVenue = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      address: form.address.trim(),
      imageUrl: form.imageUrl.trim(),
      instagramUrl: form.instagramUrl.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      isFavorite: false,
    };

    setVenues((prev) => [newVenue, ...prev]);
    setForm({
      name: "",
      address: "",
      imageUrl: "",
      instagramUrl: "",
      city: "",
      country: "",
    });
  }

  function toggleFavorite(id) {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  }

  function removeVenue(id) {
    if (!confirm("¿Eliminar esta sala?")) return;
    setVenues((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Latin Dance Map — Lista</h1>
        <p>Salas de baile latino en Europa (por ahora en formato lista).</p>
      </header>

      <section className="panel">
        <form className="form" onSubmit={addVenue}>
          <h2>Añadir nueva sala</h2>

          <div className="grid">
            <label>
              Nombre *
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nombre de la sala"
              />
            </label>

            <label>
              Dirección *
              <input
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="Calle, número, ciudad..."
              />
            </label>

            <label>
              Ciudad
              <input
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                placeholder="Ej: Málaga"
              />
            </label>

            <label>
              País
              <input
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
                placeholder="Ej: España"
              />
            </label>

            <label>
              Imagen (URL, opcional)
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </label>

            <label>
              Instagram (URL, opcional)
              <input
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instagramUrl: e.target.value }))
                }
                placeholder="https://www.instagram.com/..."
              />
            </label>
          </div>

          <button className="primary" type="submit">
            + Añadir sala
          </button>
        </form>

        <div className="filters">
          <h2>Filtro</h2>
          <div className="row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, dirección, ciudad o país..."
            />
            <label className="checkbox">
              <input
                type="checkbox"
                checked={onlyFavorites}
                onChange={(e) => setOnlyFavorites(e.target.checked)}
              />
              Solo favoritos
            </label>
          </div>
        </div>
      </section>

      <main className="list">
        <div className="listHeader">
          <h2>Salas ({filteredVenues.length})</h2>
        </div>

        {filteredVenues.length === 0 ? (
          <p className="empty">No hay resultados con ese filtro.</p>
        ) : (
          <div className="cards">
            {filteredVenues.map((v) => (
              <article className="card" key={v.id}>
                <div className="cardImage">
                  {v.imageUrl ? (
                    <img src={v.imageUrl} alt={v.name} />
                  ) : (
                    <div className="placeholder">Sin imagen</div>
                  )}
                </div>

                <div className="cardBody">
                  <div className="cardTop">
                    <h3>{v.name}</h3>
                    <button
                      className={`fav ${v.isFavorite ? "on" : ""}`}
                      onClick={() => toggleFavorite(v.id)}
                      aria-label="Favorito"
                      title="Favorito"
                      type="button"
                    >
                      {v.isFavorite ? "★" : "☆"}
                    </button>
                  </div>

                  <p className="muted">{v.address}</p>
                  {(v.city || v.country) && (
                    <p className="meta">
                      {v.city ? v.city : ""}
                      {v.city && v.country ? " · " : ""}
                      {v.country ? v.country : ""}
                    </p>
                  )}

                  <div className="actions">
                    {v.instagramUrl ? (
                      <a
                        className="link"
                        href={v.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram ↗
                      </a>
                    ) : (
                      <span className="muted">Sin Instagram</span>
                    )}

                    <button
                      className="danger"
                      onClick={() => removeVenue(v.id)}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
