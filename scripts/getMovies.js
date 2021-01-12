const d = document,
  $movies = d.getElementById("movies"),
  $errorMessage = d.querySelector(".message-error");

let arrMovie = [];

export const getMovies = () => {
  const $search = d.getElementById("search");

  d.addEventListener("keyup", (e) => {
    if (e.target === $search) {
      if (e.key === "Enter") {
        if (e.target.value === "") {
          $errorMessage.children[0].textContent = "It is'nt valid movie";
          $errorMessage.classList.remove("d-none");
          setTimeout(() => {
            $errorMessage.classList.add("d-none");
          }, 5000);
        } else {
          fetchMovies(e.target.value);
          if ($movies.hasChildNodes()) {
            $movies.textContent = "";
          }
          const $loader = d.createElement("img");
          $loader.src = "../assets/loaders/circles.svg";
          $movies.insertAdjacentElement("afterbegin", $loader);
        }
      }
    }
  });
};

const fetchMovies = async (movie) => {
  const moviesData = await fetch(
    `http://api.tvmaze.com/search/shows?q=${movie}`
  );

  if (moviesData.ok) {
    buildMovies(await moviesData.json());
  }
};

const buildMovies = (data) => {
  $movies.textContent = "";
  if (data.length > 0) {
    const $template = d.getElementById("template-card").content,
      $fragment = d.createDocumentFragment();
    data.forEach((movie) => {
      console.log(movie);
      $template.querySelector("img").src = movie.show.image
        ? movie.show.image.medium
        : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
      $template.querySelector(".card__title").textContent = movie.show.name;
      $template.querySelector(".card__description").innerHTML = movie.show
        .summary
        ? movie.show.summary
        : "No description found";
      $template.querySelector(".card__link").href = movie.show.url;
      const $templateClone = d.importNode($template, true);
      $fragment.appendChild($templateClone);
    });

    $movies.appendChild($fragment);
  } else {
    const $message = d.createElement("h1");
    $message.textContent = "No movies found";
    $movies.appendChild($message);
  }
};
