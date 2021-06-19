
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("../example-d8230-firebase-adminsdk-j9lom-3e023b6243.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://example-d8230-default-rtdb.europe-west1.firebasedatabase.app/'
});

/**
 * POST
 * Добавить предмет
 * data {
 *   name наименование товара
 *   price цена товара
 * }
 * response {
    "result": {
        "id": "-Mc_5DKLGwlHCHexiaJi",
        "name": "Phone",
        "price": 399.99
    }
}
 */
exports.addItem = functions.https.onCall((data, context)  => {
    functions.logger.info("addItem", { structuredData: true });

    if (!data.name) {
        response.status(400).send("Missing name param");
        return;
    }

    if (!data.price) {
        response.status(400).send("Missing price param");
        return;
    }

    const db = admin.database();
    const ref = db.ref("items").push();
    const item = {
        id: ref.key,
        name: data.name,
        price: data.price
    }
    ref.set(item);

    return item;
});

/**
 * GET
 * Получить товар по id
 * request.query {
 *   id уникальный идентификатор товара
 * }
 * response {
    "result": {
        "id": "-Mc_4PIVHrq9dYT3uuJW",
        "name": "Phone",
        "price": 399.99
    }
}
 */
exports.getItem = functions.https.onRequest(async (request, response) => {
    functions.logger.info("getItem", { structuredData: true });

    if (!request.query.id) {
        response.status(400).send("Missing id param");
        return;
    }

    const db = admin.database();
    const snapshot = await db.ref("items").child(request.query.id).get();
    if (snapshot.exists()) {
        response.send({
            result: snapshot.val()
        });
    } else {
        response.status(404).send();
    }
});

/**
 * POST
 * Получить пользователя по user uid
 * data {
 *   uid - уникальный идентификатор пользователя
 * }
 * response {
    "result": {
        "uid": "tjBHkgVu4yUFNNn9iy3L7jiLURuc",
        "email": null,
        "emailVerified": false,
        "displayName": "",
        "photoURL": "",
        "phoneNumber": "+79280000000",
        "disabled": false,
        "metadata": {
            "creationTime": "Sat, 19 Jun 2021 16:28:39 GMT",
            "lastSignInTime": "Sat, 19 Jun 2021 16:28:39 GMT",
            "lastRefreshTime": null
        },
        "providerData": [
            {
                "uid": "+79280000000",
                "displayName": null,
                "email": null,
                "photoURL": null,
                "providerId": "phone",
                "phoneNumber": "+79280000000"
            }
        ],
        "passwordHash": null,
        "passwordSalt": null,
        "tokensValidAfterTime": null,
        "tenantId": null
    }
}
 */
exports.getUser = functions.https.onCall(async (data, context)  => {
    return await admin.auth().getUser(data.uid);
});
