'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Levitate', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should give the user an immunity to Ground-type moves', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Rotom', ability: 'levitate', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Aggron', ability: 'sturdy', moves: ['earthquake']}]});
		assert.false.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move earthquake'));
	});

	it('should make the user airborne', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Unown', ability: 'levitate', moves: ['spore']}]});
		battle.setPlayer('p2', {team: [{species: 'Espeon', ability: 'magicbounce', moves: ['electricterrain']}]});
		battle.makeChoices('move spore', 'move electricterrain');
		assert.equal(battle.p1.active[0].status, 'drowsy', "Levitate Pokémon should not be awaken by Electric Terrain");
	});

	it('should have its Ground immunity suppressed by Mold Breaker', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['earthquake']}]});
		assert.hurts(battle.p1.active[0], () => battle.makeChoices('move sleeptalk', 'move earthquake'));
	});

	it('should have its airborne property suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['roar', 'spikes']}]});
		battle.makeChoices('move sleeptalk', 'move spikes');
		assert.hurts(battle.p1.pokemon[1], () => battle.makeChoices('move sleeptalk', 'move roar'));
	});

	it('should not have its airborne property suppressed by Mold Breaker if it switches out via Eject Button', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [
			{species: 'Cresselia', ability: 'levitate', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
		]});
		battle.setPlayer('p2', {team: [{species: 'Haxorus', ability: 'moldbreaker', moves: ['tackle', 'spikes']}]});
		battle.makeChoices('move sleeptalk', 'move spikes');
		battle.makeChoices('move sleeptalk', 'move tackle');
		assert.false.hurts(battle.p1.pokemon[1], () => battle.makeChoices('switch 2', 'move tackle'));
	});

	it('should not have its airborne property suppressed by Mold Breaker if that Pokemon is no longer active', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: 'Forretress', ability: 'levitate', item: 'redcard', moves: ['spikes']}]});
		battle.setPlayer('p2', {team: [
			{species: 'Haxorus', ability: 'moldbreaker', item: 'laggingtail', moves: ['tackle']},
			{species: 'Rotom', ability: 'levitate', moves: ['rest']},
		]});
		assert.false.hurts(battle.p2.active[0], () => battle.makeChoices('move spikes', 'move tackle'));
	});
});

describe('Levitate [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not have its airborne property suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = common.gen(4).createBattle([
			[{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}, {species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}],
			[{species: 'Rampardos', ability: 'moldbreaker', moves: ['roar', 'spikes']}],
		]);
		battle.makeChoices('move sleeptalk', 'move spikes');
		assert.false.hurts(battle.p1.pokemon[1], () => battle.makeChoices('move sleeptalk', 'move roar'));
	});
});
