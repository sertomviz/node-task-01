//import conotroller from '../src/controllers/zombieController';
import Zombie from '../src/models/zombie';
import apis from '../src/apis';
import ZombieService from '../src/services/zombies'
import axios from 'axios';
import {
	itemExchangeReply,
	currencyExchangeReply,
	zombieList,
	newZombie
} from './fixtures'
import babelPolyfill from 'babel-polyfill';

jest.mock('axios');

let zombieId;

describe("Testing the Zombie API", () => {

	it("should return zombie items", async () => { // the list contains 15 items
		axios.get.mockResolvedValue({
			data: itemExchangeReply
		})

		const items = await apis.getZombieItems();
		expect(items.length).toBe(15);
	});

	it("should return daily currency exchange rates", async () => {
		axios.get.mockResolvedValue({
			data: currencyExchangeReply
		})
		const rates = await apis.getCurrencyRates();
		expect(rates).toMatchObject({eur: 4.328, usd: 3.78})
	});

	it("should get the list of all zombies", async () => {
		const spy = jest.spyOn(ZombieService, "getAllZombies").mockReturnValueOnce(zombieList);
		ZombieService.getAllZombies({});
    const spyZombieList = spy.mock.results[0].value;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyZombieList).toMatchObject(zombieList);
    spy.mockReset();
	});

	it("should create new zombie", async () => {
		const spy = jest.spyOn(ZombieService, "createZombie").mockReturnValueOnce(newZombie);
		ZombieService.createZombie(newZombie);
    const spyCreatedZombie = spy.mock.results[0].value;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyCreatedZombie.name).toEqual(newZombie.name);
    spy.mockReset();
	});


});
