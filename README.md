# Express CRUD

### Creazione rotte per le crud

Creare le seguenti rotte:

- **/** POST rotta store che riceverà nuovi dati e creerà un nuovo post. Dati in formato **application/x-www-urlencoded**. Redirect in caso di risposta html, json del post in caso di richiesta json
- **/:slug** DELETE rotta destroy che dovrà ritornare un redirect in caso di risposta html, json con messaggio di avvenuta cancellazione in caso di richiesta json.
  Ritorna un 404 in caso di post non corrispondente, usare un middleware.

Aggiungere un middleware globale per gestire gli errori.

### Bonus

Salvare l' array dei post in un json
Nella funzione store permettere di passare i dati in formato **multipart/form-data** tramite **multer**
Permettere di eseguire upload di file immagine
