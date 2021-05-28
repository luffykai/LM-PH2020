const fs = require("fs");

async function main() {
    const oc4ids = JSON.parse(fs.readFileSync("app/public/data/full-0830.json"));
    for (key in oc4ids) {
        console.log("key", key);
        const projects = oc4ids[key]["projects"];
        for (let i = 0; i < projects.length; i++) {
            projects[i]["id"] = "oc4ids-4fnom3" + "-" + projects[i]["id"];
        }
    }

    // for (key in oc4ids) {
    //     console.log("key", key);
    //     const projects = oc4ids[key]["projects"];
    //     for (let i = 0; i < projects.length; i++) {
    //         console.log(projects[i]["id"]);
    //     }
    // }
    fs.writeFile(
        "app/public/data/full-05282021.json",
        JSON.stringify(oc4ids, null, 4),
        (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        }
    );
}

main();