export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        À propos de Courses à pied Algérie
      </h1>

      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
        Ce site a été créé pour recenser toutes les courses à pied en Algérie, afin de faciliter leur
        découverte par les coureurs. Nous essayons de rester en contact avec les organisateurs et
        d’obtenir leur approbation avant de publier leurs événements. Cela permet aux coureurs
        algériens de savoir facilement quand et où courir, tout en bénéficiant d’informations précises.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
        Pour les organisateurs
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Si vous êtes un organisateur de course, vous pouvez nous contacter directement par email pour
        que nous ajoutions votre événement. Nous collectons toutes les informations nécessaires
        afin de présenter vos courses correctement et avec votre accord.
      </p>

      <p className="text-gray-700 dark:text-gray-300">
        Envoyez un email à <strong>contact@coursesalgerie.com</strong> avec les informations suivantes :
      </p>

      <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
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

      <p className="text-gray-700 dark:text-gray-300">
        La publication de l’événement se fera manuellement par l’administrateur, afin de garantir
        la fiabilité des informations.
      </p>

      <p className="text-gray-600 dark:text-gray-400 italic">
        Nous nous efforçons de rendre ce site le plus précis et utile possible pour tous les coureurs
        algériens.
      </p>
    </div>
  );
}
