//
// Tests of the parser
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { expect } from 'chai';
import { ASMLine, HoverInstruction, HoverInstructionsManager } from '../parser';


// tslint:disable:no-unused-expression
describe("Parser Tests", function () {
    context("ASM Line parsing", function () {
        it("Should split a comment line", function () {
            let asmLine = new ASMLine("  ;My Comment ");
            expect(asmLine.comment).to.be.equal(";My Comment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
            asmLine = new ASMLine("  ******--***** ");
            expect(asmLine.comment).to.be.equal("******--*****");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
        });
        it("Should parse a label line", function () {
            let asmLine = new ASMLine("mylabel");
            expect(asmLine.label).to.be.equal("mylabel");
            expect(asmLine.comment).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.instruction).to.be.empty;
        });
        it("Should parse a single line instruction", function () {
            let asmLine = new ASMLine(" rts");
            expect(asmLine.instruction).to.be.equal("rts");
            expect(asmLine.comment).to.be.empty;
            expect(asmLine.data).to.be.empty;
            expect(asmLine.label).to.be.empty;
        });
        it("Should parse an entire line", function () {
            let asmLine = new ASMLine("\t.mylabel\t\tmove.l #mempos,d1     ; mycomment");
            expect(asmLine.label).to.be.equal(".mylabel");
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal("; mycomment");
            asmLine = new ASMLine("mylabel move.l #mempos,d1;mycomment");
            expect(asmLine.label).to.be.equal("mylabel");
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal(";mycomment");
        });
        it("Should parse a line without label", function () {
            let asmLine = new ASMLine("\t\tmove.l #mempos,d1     ; mycomment");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.equal("; mycomment");
        });
        it("Should parse a line without labels nor comment", function () {
            let asmLine = new ASMLine("\t\tmove.l #mempos,d1 ");
            expect(asmLine.label).to.be.empty;
            expect(asmLine.instruction).to.be.equal("move.l");
            expect(asmLine.data).to.be.equal("#mempos,d1");
            expect(asmLine.comment).to.be.empty;
        });
    });
    context("Hover file parsing", function () {
        it("Should read the file correctly", function () {
            let manager = new HoverInstructionsManager();
            expect(manager.instructions.size).to.be.equal(61);
            let list = manager.instructions.get("ADD");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[0];
                expect(hi.instruction).to.be.equal("ADD");
                expect(hi.decription).to.be.equal("ADD binary");
                expect(hi.syntax).to.have.members(["Dx,Dy", "Dn,<ea>", "<ea>,Dn"]);
                expect(hi.size).to.be.equal("BWL");
                expect(hi.x).to.be.equal("*");
                expect(hi.n).to.be.equal("*");
                expect(hi.z).to.be.equal("*");
                expect(hi.v).to.be.equal("*");
                expect(hi.c).to.be.equal("*");
            }
            list = manager.instructions.get("MOVE");
            expect(list).to.not.be.undefined;
            if (list) {
                let hi = list[1];
                expect(hi.instruction).to.be.equal("MOVE");
                expect(hi.decription).to.be.equal("Copy value");
                expect(hi.syntax).to.have.members(["Rn,Dy"]);
                expect(hi.size).to.be.equal("-WL");
                expect(hi.x).to.be.equal("-");
                expect(hi.n).to.be.equal("*");
                expect(hi.z).to.be.equal("*");
                expect(hi.v).to.be.equal("0");
                expect(hi.c).to.be.equal("0");
            }
        });
        it("Should parse a correct line", function () {
            let hi = HoverInstruction.parse("ADD;ADD binary;Dx,Dy|Dn,<ea>|<ea>,Dn;BWL;1;2;3;4;5");
            expect(hi.instruction).to.be.equal("ADD");
            expect(hi.decription).to.be.equal("ADD binary");
            expect(hi.syntax).to.have.members(["Dx,Dy", "Dn,<ea>", "<ea>,Dn"]);
            expect(hi.size).to.be.equal("BWL");
            expect(hi.x).to.be.equal("1");
            expect(hi.n).to.be.equal("2");
            expect(hi.z).to.be.equal("3");
            expect(hi.v).to.be.equal("4");
            expect(hi.c).to.be.equal("5");
        });
        it("Should return null if a line parse fail", function () {
            let hi = HoverInstruction.parse("ADD;ADD binary");
            expect(hi).to.be.null;
        });

    });
});