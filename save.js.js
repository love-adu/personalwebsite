export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method not allowed" });
  }

  var body = req.body || {};
  if (body.password !== process.env.SITE_PASSWORD) {
    return res.status(401).json({ message: "wrong password" });
  }
  if (!body.html) {
    return res.status(400).json({ message: "no html sent" });
  }

  var owner = process.env.GH_OWNER;
  var repo = process.env.GH_REPO;
  var path = process.env.GH_PATH || "index.html";
  var branch = process.env.GH_BRANCH || "main";
  var token = process.env.GITHUB_TOKEN;

  try {
    var getRes = await fetch(
      "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path + "?ref=" + branch,
      { headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" } }
    );
    if (!getRes.ok) throw new Error("couldn't read the current file from github (status " + getRes.status + ")");
    var fileData = await getRes.json();

    var content = Buffer.from(body.html, "utf-8").toString("base64");

    var putRes = await fetch(
      "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + path,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "update site content",
          content: content,
          sha: fileData.sha,
          branch: branch
        })
      }
    );
    if (!putRes.ok) {
      var errJson = await putRes.json();
      throw new Error(errJson.message || "save failed (status " + putRes.status + ")");
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
