import { clc } from '@nestjs/common/utils/cli-colors.util';
import { repl } from '@nestjs/core';
import { ReplContext } from '@nestjs/core/repl/repl-context';
import {
  HelpReplFn,
  GetReplFn,
  ResolveReplFn,
  SelectReplFn,
  DebugReplFn,
  MethodsReplFn,
} from '@nestjs/core/repl/native-functions';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { AppModule } from '../src/app.module';
import { UsersModule } from '../src/users/users.module';

const prompt = '\u001b[1G\u001b[0J\u001b[32m>\u001b[0m \u001b[3G';

describe('REPL', () => {
  beforeEach(() => {
    // To avoid coloring the output:
    sinon.stub(clc, 'bold').callsFake(text => text);
    sinon.stub(clc, 'green').callsFake(text => text);
    sinon.stub(clc, 'yellow').callsFake(text => text);
    sinon.stub(clc, 'red').callsFake(text => text);
    sinon.stub(clc, 'magentaBright').callsFake(text => text);
    sinon.stub(clc, 'cyanBright').callsFake(text => text);
  });
  afterEach(() => {
    sinon.restore();
    delete globalThis[AppModule.name];
    delete globalThis[UsersModule.name];
  });

  it('get()', async () => {
    const server = await repl(AppModule);

    let outputText = '';
    sinon.stub(process.stdout, 'write').callsFake(text => {
      outputText += text;
      return true;
    });
    server.emit('line', 'get(UsersService)');

    expect(outputText).to.equal(
      `UsersService { usersRepository: UsersRepository {} }
${prompt}`,
    );

    outputText = '';
    server.emit('line', 'get(UsersService).findAll()');

    expect(outputText).to
      .equal(`\u001b[32m'This action returns all users'\u001b[39m
${prompt}`);

    outputText = '';
    server.emit('line', 'get(UsersRepository)');

    expect(outputText).to.equal(`UsersRepository {}
${prompt}`);
  });

  it('debug()', async () => {
    const server = await repl(AppModule);

    let outputText = '';
    sinon.stub(process.stdout, 'write').callsFake(text => {
      outputText += text;
      return true;
    });
    server.emit('line', 'debug(UsersModule)');

    expect(outputText).to.equal(
      `
UsersModule:
 - controllers:
  ◻ UsersController
 - providers:
  ◻ UsersService
  ◻ UsersRepository

${prompt}`,
    );
  });

  it('methods()', async () => {
    const server = await repl(AppModule);

    let outputText = '';
    sinon.stub(process.stdout, 'write').callsFake(text => {
      outputText += text;
      return true;
    });
    server.emit('line', 'methods(UsersRepository)');

    expect(outputText).to.equal(
      `
Methods:
 ◻ find

${prompt}`,
    );

    outputText = '';
    server.emit('line', 'methods(UsersService)');

    expect(outputText).to.equal(
      `
Methods:
 ◻ create
 ◻ findAll
 ◻ findOne
 ◻ update
 ◻ remove

${prompt}`,
    );
  });

  describe('<native_function>.help', () => {
    it(`Typing "help.help" should print function's description and interface`, async () => {
      const replServer = await repl(AppModule);

      const { description, signature } = new HelpReplFn(
        sinon.stub() as unknown as ReplContext,
      ).fnDefinition;
      let outputText = '';
      sinon.stub(process.stdout, 'write').callsFake(text => {
        outputText += text;
        return true;
      });

      replServer.emit('line', 'help.help');

      expect(outputText).to.equal(`${description}
Interface: help${signature}
${prompt}`);
    });

    it(`Typing "get.help" should print function's description and interface`, async () => {
      const replServer = await repl(AppModule);

      const { description, signature } = new GetReplFn(
        sinon.stub() as unknown as ReplContext,
      ).fnDefinition;
      let outputText = '';
      sinon.stub(process.stdout, 'write').callsFake(text => {
        outputText += text;
        return true;
      });

      replServer.emit('line', 'get.help');

      expect(outputText).to.equal(`${description}
Interface: get${signature}
${prompt}`);
    });

    it(`Typing "resolve.help" should print function's description and interface`, async () => {
      const replServer = await repl(AppModule);

      const { description, signature } = new ResolveReplFn(
        sinon.stub() as unknown as ReplContext,
      ).fnDefinition;
      let outputText = '';
      sinon.stub(process.stdout, 'write').callsFake(text => {
        outputText += text;
        return true;
      });

      replServer.emit('line', 'resolve.help');

      expect(outputText).to.equal(`${description}
Interface: resolve${signature}
${prompt}`);
    });

    it(`Typing "select.help" should print function's description and interface`, async () => {
      const replServer = await repl(AppModule);

      const { description, signature } = new SelectReplFn(
        sinon.stub() as unknown as ReplContext,
      ).fnDefinition;
      let outputText = '';
      sinon.stub(process.stdout, 'write').callsFake(text => {
        outputText += text;
        return true;
      });

      replServer.emit('line', 'select.help');

      expect(outputText).to.equal(`${description}
Interface: select${signature}
${prompt}`);
    });

    it(`Typing "debug.help" should print function's description and interface`, async () => {
      const replServer = await repl(AppModule);

      const { description, signature } = new DebugReplFn(
        sinon.stub() as unknown as ReplContext,
      ).fnDefinition;
      let outputText = '';
      sinon.stub(process.stdout, 'write').callsFake(text => {
        outputText += text;
        return true;
      });

      replServer.emit('line', 'debug.help');

      expect(outputText).to.equal(`${description}
Interface: debug${signature}
${prompt}`);
    });

    it(`Typing "methods.help" should print function's description and interface`, async () => {
      const replServer = await repl(AppModule);

      const { description, signature } = new MethodsReplFn(
        sinon.stub() as unknown as ReplContext,
      ).fnDefinition;
      let outputText = '';
      sinon.stub(process.stdout, 'write').callsFake(text => {
        outputText += text;
        return true;
      });

      replServer.emit('line', 'methods.help');

      expect(outputText).to.equal(`${description}
Interface: methods${signature}
${prompt}`);
    });
  });
});
