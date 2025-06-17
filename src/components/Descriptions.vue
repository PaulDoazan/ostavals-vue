<template>
  <div class="w-100 overflow-y-auto">
    <VRow>
      <!-- Caractéristiques de production -->
      <VCol cols="12" md="4">
        <div class="rounded-lg shadow-md pa-6">
          <h2 class="font-weight-bold mb-4">Caractéristiques de production</h2>
          <div class="d-flex flex-column ga-4 overflow-y-auto custom-scrollbar" style="max-height: 600px;">
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
      </VCol>

      <!-- Produits -->
      <VCol cols="12" md="4">
        <div class="rounded-lg shadow-md pa-6 h-100" :style="{ backgroundColor: 'rgb(var(--v-theme-background))' }">
          <h2 class="font-weight-bold mb-4">Produits</h2>
          <div class="d-flex flex-column ga-4 overflow-y-auto custom-scrollbar" style="max-height: 600px;">
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
      </VCol>

      <!-- Chiffres clés -->
      <VCol cols="12" md="4">
        <div class="rounded-lg shadow-md pa-6 h-100" :style="{ backgroundColor: 'rgb(var(--v-theme-background))' }">
          <h2 class="font-weight-bold mb-4">Chiffres clés</h2>
          <div class="d-flex flex-column ga-4 overflow-y-auto custom-scrollbar" style="max-height: 600px;">
            <div>
              Nombre de
              producteurs
              Une centaine
              de fermes
            </div>
          </div>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
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