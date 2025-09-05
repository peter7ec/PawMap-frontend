# PawMap - Frontend

 <!-- Helyettesítsd ezt egy logóval, ha van -->

Üdv a PawMap projekt frontend repository-jában! A PawMap egy webalkalmazás, amely segít a kutyabarát helyek felfedezésében és megosztásában.

**Élő oldal:** [**pawmap.eu**](https://pawmap.eu)

---

### Tartalomjegyzék

- [Projekt bemutatása](#projekt-bemutatása)
- [Főbb funkciók](#főbb-funkciók)
- [Felhasznált technológiák](#felhasznált-technológiák)
- [Telepítés és futtatás](#telepítés-és-futtatás)
- [Backend Repository](#backend-repository)

---

### Projekt bemutatása

A PawMap célja, hogy összegyűjtse és egy interaktív térképen jelenítse meg azokat a helyeket (éttermek, parkok, üzletek stb.), ahová a kutyusodat is magaddal viheted. A felhasználók új helyeket adhatnak hozzá a térképhez, és böngészhetnek a már meglévők között.

_Helyettesítsd ezt egy képernyőképpel a működő alkalmazásról:_

### Főbb funkciók

- **Interaktív térkép:** Böngéssz a kutyabarát helyek között egy térképes felületen.
- **Helyek hozzáadása:** Regisztrált felhasználóként új kutyabarát helyeket adhatsz hozzá a térképhez.
- **Keresés és szűrés:** Keress helyekre név, kategória vagy város alapján.
- **Felhasználói fiók:** Regisztráció és bejelentkezés a személyes funkciók eléréséhez.
- **Reszponzív dizájn:** Az alkalmazás mobiltelefonon és asztali gépen is kényelmesen használható.

### Felhasznált technológiák

Ez a projekt a modern frontend technológiákra épül, hogy gyors és felhasználóbarát élményt nyújtson.

- **Keretrendszer:** [React](https://reactjs.org/)
- **Build eszköz:** [Vite](https://vitejs.dev/)
- **Nyelv:** [TypeScript](https://www.typescriptlang.org/)
- **Stílusozás:** [Tailwind CSS](https://tailwindcss.com/)
- **Komponens könyvtár:** [shadcn/ui](https://ui.shadcn.com/)
- **Térkép:** Leaflet <!-- Válaszd ki, melyiket használod -->
- **API kommunikáció:** Egyedi, service-alapú API kezelő réteg

### Telepítés és futtatás

Kövesd az alábbi lépéseket a projekt helyi környezetben való futtatásához:

1.  **Klónozd a repository-t:**

    ```
    git clone https://github.com/peter7ec/PawMap-frontend.git
    cd PawMap-frontend
    ```

2.  **Telepítsd a függőségeket:**

    ```
    npm install
    ```

3.  **Hozd létre a környezeti változók fájlját:**
    Hozd létre a projekt gyökérkönyvtárában a `.env` fájlt a `.env.example` alapján, és add meg a backend API végpontját.

    ```
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

4.  **Indítsd el a fejlesztői szervert:**
    ```
    npm run dev
    ```
    Ezután a projekt elérhető lesz a `http://localhost:5173` címen (vagy amit a Vite kiír a terminálba).

### Backend Repository

A frontendhez tartozó backend (Express.js, Prisma, PostgreSQL) egy külön repository-ban található.

[**PawMap Backend Repository**](https://github.com/peter7ec/PawMap-backend) <!-- Frissítsd a linket, ha már létezik -->

---

```

```
