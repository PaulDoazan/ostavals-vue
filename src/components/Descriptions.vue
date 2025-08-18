<template>
  <div class="w-full overflow-y-auto">
    <div class="descriptions-grid">
      <!-- Caractéristiques de production -->
      <div class="description-card">
        <div class="rounded-lg shadow-md p-6">
          <h2 class="font-bold mb-4">Caractéristiques de production</h2>
          <div class="flex flex-col overflow-y-auto custom-scrollbar" style="max-height: 600px;">
            <div class="mb-4">
              Les variétés et/ou les
              races sont de souche
              locale ou conduites de
              manière rustique.
            </div>
            <div class="mb-4">
              Le producteur ne
              transforme que la
              matière première issue
              de sa ferme, et garantit
              le caractère fermier de
              son produit.
            </div>
            <div class="mb-4">
              Les élevages sont
              obligatoirement de petite
              taille et de plein air. La
              traite est manuelle.
            </div>
            <div class="mb-4">
              Les cultures sont
              de saison, de plein
              champ et récoltées à
              maturité.
            </div>
          </div>
        </div>
      </div>

      <!-- Produits -->
      <div class="description-card">
        <div class="rounded-lg shadow-md p-6 h-full bg-background">
          <h2 class="font-bold mb-4">Produits</h2>
          <div class="flex flex-col gap-4 overflow-y-auto custom-scrollbar" style="max-height: 600px;">
            <div>
              Production animale ou végétale
              qui respecte le cahier des charges.
              Aujourd'hui IDOKI rassemble 17
              familles de produits (fromage de
              vache, de chèvre, légumes, miel,
              viandes, cidre)
            </div>
          </div>
        </div>
      </div>

      <!-- Chiffres clés -->
      <div class="description-card">
        <div class="rounded-lg shadow-md p-6 h-full bg-background">
          <h2 class="font-bold mb-4">Chiffres clés</h2>
          <div class="flex flex-col gap-4 overflow-y-auto custom-scrollbar" style="max-height: 600px;">
            <div>
              Nombre de
              producteurs
              Une centaine
              de fermes
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.descriptions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.description-card {
  min-height: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  display: block;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>