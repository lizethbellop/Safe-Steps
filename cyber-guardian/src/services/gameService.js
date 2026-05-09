import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

export const guardarResultadoJuego = async (
  perfilId,
  nombreJuego,
  puntaje,
  errores = [],
) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId || !perfilId) {
      console.warn(
        "⚠️ No hay sesión activa o perfil seleccionado. No se guardará en BD.",
      );
      return;
    }

    const partidasRef = collection(
      db,
      `usuarios/${userId}/perfiles/${perfilId}/partidas`,
    );
    await addDoc(partidasRef, {
      juego: nombreJuego,
      puntajeObtenido: puntaje,
      errores: errores,
      fecha: new Date().toISOString(),
    });

    const perfilRef = doc(db, `usuarios/${userId}/perfiles/${perfilId}`);
    await updateDoc(perfilRef, {
      puntosExperiencia: increment(puntaje),
    });

    console.log(`✅ Partida de ${nombreJuego} guardada correctamente.`);
  } catch (error) {
    console.error("❌ Error al guardar la partida en Firestore:", error);
  }
};
