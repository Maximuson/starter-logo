import { useState } from "react";
import { prisma } from "../lib/prisma";

/**
 * Home page component.
 *
 * `users` is loaded on the server via `getStaticProps` below and passed in as a
 * prop before the page renders. On GitHub Pages (static export) the list is
 * empty and `usersUnavailableReason` explains why.
 */
const Home = ({ users, usersUnavailableReason }) => {
  const [comets, setComets] = useState([{ degree: 0, size: 8 }]);

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const addComet = () => {
    const MAX_PHONE_DOT_SIZE = 4;
    const MAX_TABLET_DOT_SIZE = 6;
    const MAX_DESKTOP_DOT_SIZE = 14;

    const isPhone = window.document.body.offsetWidth <= 767;
    const isTablet = window.document.body.offsetWidth <= 991;

    let maxDotSize = MAX_DESKTOP_DOT_SIZE;

    if (isTablet) {
      maxDotSize = MAX_TABLET_DOT_SIZE;
    }

    if (isPhone) {
      maxDotSize = MAX_PHONE_DOT_SIZE;
    }

    const item = {
      degree: randomIntFromInterval(-15, 15),
      size: randomIntFromInterval(2, maxDotSize),
    };
    setComets([...comets, { ...item }]);
  };

  return (
    <div className={"welcome"}>
      <h1 className="welcome__greeting" onClick={addComet}>
        <span className="welcome_app-text">New App</span>
        <span className="bg-text bg-text-3"> New App</span>
        <span className="bg-text bg-text-2"> New App</span>
        <span className="bg-text bg-text-1"> New App</span>
        {comets.map((item, index) => (
          <div
            key={index}
            className="comet__line"
            style={{
              transform: `rotateZ(${item.degree}deg)`,
            }}
          >
            <div
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
              }}
              className="comet"
            ></div>
          </div>
        ))}
        <div className="comet-8"></div>
      </h1>

      {/* Simple backend demo: users loaded from Postgres through Prisma */}
      <section className="users">
        <h2 className="users__title">Users from database</h2>
        <p className="users__hint">Loaded via Prisma and DATABASE_URL</p>
        {usersUnavailableReason ? (
          <p className="users__unavailable">{usersUnavailableReason}</p>
        ) : (
          <ul className="users__list">
            {users.map((user) => (
              <li key={user.id} className="users__item">
                <span className="users__name">{user.name}</span>
                <span className="users__email">{user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

/**
 * Static/SSR data loader for the Pages Router.
 *
 * Uses getStaticProps instead of getServerSideProps so GitHub Pages static
 * export (output: "export") can build successfully.
 *
 * - GitHub Pages: no database at runtime → show explanation message
 * - Docker dev: DATABASE_URL set → fetch users (re-runs each request in dev)
 * - CI build: no DATABASE_URL → empty list, build still passes
 */
export async function getStaticProps() {
  if (process.env.GITHUB_PAGES === "true") {
    return {
      props: {
        users: [],
        usersUnavailableReason:
          "Database demo is not available on static GitHub Pages hosting. Run with Docker locally or in Cursor Cloud to see live data.",
      },
    };
  }

  if (!process.env.DATABASE_URL) {
    return {
      props: {
        users: [],
        usersUnavailableReason: null,
      },
    };
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      props: {
        users,
        usersUnavailableReason: null,
      },
    };
  } catch (error) {
    console.error("Failed to load users:", error);
    return {
      props: {
        users: [],
        usersUnavailableReason: null,
      },
    };
  }
}

export default Home;
