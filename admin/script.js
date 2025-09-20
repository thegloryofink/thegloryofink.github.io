    const baseUrl = "/Blog";

    async function loadPoemList() {
      try {
        const res = await fetch(baseUrl + "/index.html", { mode: "cors" });
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const poems = doc.querySelectorAll(".poem-link");
        const select = document.getElementById("poem-select");

        poems.forEach(poem => {
          const url = poem.getAttribute("href");
          const title = poem.querySelector("h3")?.textContent.trim();
          if (url && title) {
            const option = document.createElement("option");
            option.value = url;
            option.textContent = title;
            select.appendChild(option);
          }
        });
      } catch (err) {
        console.error("Error loading poem list:", err);
      }
    }

    async function loadPoem() {
      const select = document.getElementById("poem-select");
      const url = select.value;
      if (!url) return;

      try {
        const res = await fetch(baseUrl + "/" + url, { mode: "cors" });
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const title = doc.querySelector(".poem-title")?.textContent.trim() || "Untitled";
        const content = doc.querySelector(".poem-full pre")?.textContent.trim() || "No content found";

        document.getElementById("poem-title").textContent = title;
        document.getElementById("poem-content").textContent = content;

        adjustFontSize();
      } catch (err) {
        console.error("Error loading poem:", err);
      }
    }

    function adjustFontSize() {
      const poemBox = document.getElementById("poem-content");
      let fontSize = 42;
      poemBox.style.fontSize = fontSize + "px";

      while (poemBox.scrollHeight > poemBox.clientHeight && fontSize > 16) {
        fontSize -= 2;
        poemBox.style.fontSize = fontSize + "px";
      }
    }

    document.getElementById("export-btn").addEventListener("click", () => {
      const post = document.getElementById("post");
      html2canvas(post, { useCORS: true, scale: 2 }).then(canvas => {
        const link = document.createElement("a");
        link.download = document.getElementById("poem-title").textContent + ".png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    });

    document.getElementById("load-btn").addEventListener("click", loadPoem);
    window.onload = loadPoemList;