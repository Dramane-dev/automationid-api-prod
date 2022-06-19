import axios from "axios";

export const axiosInstanceToMailVerification = axios.create({
    baseURL:
        "https://prod-26.westeurope.logic.azure.com/workflows/86b39175e0014ad792c6df26979b6c3b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcFxydmxiDgglSr17MNF4kdWGBLbP3DLkAMyrytb4FQ",
});

export const axiosInstanceToSendProjectNotification = axios.create({
    baseURL:
        "https://prod-160.westeurope.logic.azure.com:443/workflows/8991d3fb41604deaa087e74a35aea23b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wnu1j51vIZUXOvEe4pUsokdxoWKWdhLz9p0fQ-IKf_g",
});
