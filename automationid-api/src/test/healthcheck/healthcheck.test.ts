import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import assert, { doesNotMatch } from "assert";
import { healthCheckRoute } from "../../routes/healthCheck/healthCheckRoute";
import { main } from "../../server";
import { IServerStatus } from "../../interfaces/health/IServerStatus";

let should: Chai.Should = chai.should();
chai.use(chaiHttp);

describe("[ Server ]", () => {
    describe("[ Server Health Check ]", () => {
        it("Status of response should be 200 when user call it endpoint", async (done) => {
            let url: string = "http://localhost:3030/api/healthcheck";
            chai.request(await main)
                .get(url)
                .end((err, res) => {
                    console.log(res);
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    expect(res.body.status).eq("OK");
                    done();
                });
        });
        it("Trhow an error if server not respond", async () => {});
    });
});
