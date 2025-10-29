export default function InfoPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-6 md:py-10 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center sm:text-left">
        À propos de Courses à pied Algérie
      </h1>

      <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
        <strong>Courses Algérie</strong> est un petit projet personnel, créé par
        des passionnés de course à pied, dans un esprit entièrement{" "}
        <strong>non lucratif</strong>. Notre objectif est simple&nbsp;: offrir
        aux coureurs algériens une plateforme claire et pratique pour découvrir
        les courses organisées à travers tout le pays.
      </p>

      <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
        Le site est totalement <strong>gratuit</strong> pour les organisateurs
        et les coureurs. Nous essayons toujours de{" "}
        <strong>contacter les organisateurs</strong> avant de publier un
        événement, afin d’obtenir leur accord et de confirmer les informations.
        Même si la publication est gratuite et sans contrainte, nous tenons à ce
        que tout soit validé par les personnes concernées.
      </p>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8">
        Pour les organisateurs
      </h2>

      <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
        Si vous organisez une course, vous pouvez nous contacter pour{" "}
        <strong>ajouter</strong> ou <strong>modifier</strong> votre événement
        sur le site. Nous rassemblons toutes les informations nécessaires pour
        présenter correctement votre course, avec votre accord.
      </p>

      <p className="text-gray-200 text-base sm:text-lg">
        Vous pouvez nous écrire directement à{" "}
        <a
          href="mailto:coursesalgerie@gmail.com"
          className="text-orange-400 hover:text-orange-300 underline break-all"
        >
          coursesalgerie@gmail.com
        </a>{" "}
        en indiquant les informations suivantes :
      </p>

      <ul className="list-disc ml-5 sm:ml-6 space-y-1 text-gray-200 text-base">
        <li>Nom de la course</li>
        <li>Date et lieu (wilaya)</li>
        <li>Distance et type de course</li>
        <li>Conditions de participation</li>
        <li>Tranche d’âge des participants</li>
        <li>Prix éventuels</li>
        <li>Nom de l’organisateur, email, téléphone, site web</li>
        <li>Logo ou affiche de la course (si disponible)</li>
        <li>Optionnel : preuve d’identité de l’organisateur</li>
      </ul>

      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
        Chaque ajout est vérifié manuellement pour garantir la fiabilité des
        informations publiées. En cas de doute ou de problème, vous pouvez nous
        contacter à tout moment pour confirmer ou corriger les données.
      </p>

      <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
        Si vous constatez une erreur, souhaitez retirer ou mettre à jour une
        course, ou simplement poser une question, n’hésitez pas à nous contacter
        à{" "}
        <a
          href="mailto:coursesalgerie@gmail.com"
          className="text-orange-400 hover:text-orange-300 underline break-all"
        >
          coursesalgerie@gmail.com
        </a>
        .
      </p>

      <p className="text-gray-400 italic text-center text-sm sm:text-base pt-4">
        Merci à tous les coureurs, clubs et bénévoles qui participent à faire
        vivre la course à pied en Algérie 🏃‍♂️🇩🇿
      </p>
    </div>
  );
}
