// Transcrypt'ed from Python, 2019-05-14 16:27:16
var re = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_re__ from './re.js';
__nest__ (re, '', __module_re__);
var __name__ = '__main__';
export var Tables = dict ({'intervals': dict ({'intervalToTuple': dict ({'1': tuple ([1, 0]), '2': tuple ([2, 2]), 'b3': tuple ([3, 3]), '3': tuple ([3, 4]), '4': tuple ([4, 5]), 'b5': tuple ([5, 6]), '5': tuple ([5, 7]), '#5': tuple ([5, 8]), '6': tuple ([6, 9]), 'bb7': tuple ([7, 9]), 'b7': tuple ([7, 10]), '7': tuple ([7, 11]), '9': tuple ([9, 14]), 'b9': tuple ([9, 13]), '#9': tuple ([9, 15]), '11': tuple ([11, 17]), '#11': tuple ([11, 18]), 'b13': tuple ([13, 20]), '13': tuple ([13, 21]), 's5': tuple ([5, 8]), 's9': tuple ([9, 15]), 's11': tuple ([11, 18])}), 'shorthandToIntervals': dict ({'maj': tuple (['1', '3', '5']), 'min': tuple (['1', 'b3', '5']), 'dim': tuple (['1', 'b3', 'b5']), 'aug': tuple (['1', '3', '#5']), 'maj7': tuple (['1', '3', '5', '7']), 'min7': tuple (['1', 'b3', '5', 'b7']), '7': tuple (['1', '3', '5', 'b7']), 'dim7': tuple (['1', 'b3', 'b5', 'bb7']), 'hdim7': tuple (['1', 'b3', 'b5', 'b7']), 'minmaj7': tuple (['1', 'b3', '5', '7']), 'maj6': tuple (['1', '3', '5', '6']), 'min6': tuple (['1', 'b3', '5', '6']), '9': tuple (['1', '3', '5', 'b7', '9']), 'maj9': tuple (['1', '3', '5', '7', '9']), 'min9': tuple (['1', 'b3', '5', 'b7', '9']), '9sus': tuple (['1', '4', '5', 'b7', '9']), 'sus9': tuple (['1', '4', '5', 'b7', '9']), '11': tuple (['1', '3', '5', 'b7', '11']), '13': tuple (['1', '3', '5', 'b7', '13']), 'sus2': tuple (['1', '2', '5']), 'sus4': tuple (['1', '4', '5']), '6': tuple (['1', '3', '5', '6']), 'hdim': tuple (['1', 'b3', 'b5', 'b7'])})}), 'notes': dict ({'naturalToStep': dict ({'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6}), 'naturalToHalfStep': dict ({'Cbb': 10, 'Cb': 11, 'C': 0, 'Dbb': 0, 'Db': 1, 'D': 2, 'Ebb': 2, 'Eb': 3, 'E': 4, 'Fb': 4, 'F': 5, 'Gb': 6, 'G': 7, 'Abb': 7, 'Ab': 8, 'A': 9, 'Bbb': 9, 'Bb': 10, 'B': 11, 'C#': 1, 'C##': 2, 'D#': 3, 'E#': 5, 'F#': 6, 'G#': 8, 'A#': 10, 'B#': 12}), 'stepToNatural': dict ({'0': 'C', '1': 'D', '2': 'E', '3': 'F', '4': 'G', '5': 'A', '6': 'B'}), 'natural': ['A', 'B', 'C', 'D', 'E', 'F', 'G'], 'flat': ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'], 'sharp': ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']})});
export var Chord =  __class__ ('Chord', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, root, intervals, bass) {
		self.root = root;
		self.intervals = intervals;
		self.bass = bass;
		self.spelling = [];
	});},
	get toString () {return __get__ (this, function (self) {
		return (((self.root + ':') + str (self.intervals)) + '/') + self.bass;
	});},
	get getSpelling () {return __get__ (this, function (self) {
		
		var notes = [self.root];
		for (var i = 1; i < len (self.intervals); i++) {
			notes.append (self.noteFromInterval (self.intervals [i]));
		}
		self.spelling = notes;
		
		return self.spelling;
	});},
	get getNoteArray () {return __get__ (this, function (self) {
		var noteArray = (function () {
			var __accu0__ = [];
			for (var c = 0; c < 12; c++) {
				__accu0__.append (0);
			}
			return __accu0__;
		}) ();
		var rootNumeral = Tables ['notes'] ['naturalToHalfStep'] [self.root];
		noteArray [__mod__ (rootNumeral, 12)] = 1;
		for (var i = 0; i < len (self.intervals); i++) {
			var halfStep = self.intervals [i] [1];
			noteArray [__mod__ (rootNumeral + halfStep, 12)] = 1;
		}
		return noteArray;
	});},
	get noteFromInterval () {return __get__ (this, function (self, interval) {
		var rootNumeral = Tables ['notes'] ['naturalToStep'] [self.root [0]] - 1;
		var natural = Tables ['notes'] ['stepToNatural'] [str (__mod__ (rootNumeral + interval [0], 7))];
		var naturalHalfSteps = Tables ['notes'] ['naturalToHalfStep'] [natural];
		var rootHalfSteps = Tables ['notes'] ['naturalToHalfStep'] [self.root];
		if (self.root == 'Cb') {
			naturalHalfSteps += 12;
		}
		if (naturalHalfSteps - rootHalfSteps < 0) {
			var halfStepOffset = __mod__ (interval [1], 12) - ((naturalHalfSteps + 12) - rootHalfSteps);
		}
		else {
			var halfStepOffset = __mod__ (interval [1], 12) - (naturalHalfSteps - rootHalfSteps);
		}
		if (halfStepOffset == 0) {
			var accidental = '';
		}
		else if (halfStepOffset > 0) {
			//var accidental = '#' * halfStepOffset;
			var accidental = '#'.repeat(halfStepOffset)
		}
		else if (halfStepOffset < 0) {
			//var accidental = 'b' * (-(1) * halfStepOffset);
			var accidental = 'b'.repeat((-1)*halfStepOffset)
		}
		return natural + accidental;
	});}
});
export var parseChord = function (stringChord) {
	var __left0__ = tuple (['', '', '']);
	var root = __left0__ [0];
	var intervals = __left0__ [1];
	var bass = __left0__ [2];
	if (__in__ (':', stringChord) && __in__ ('/', stringChord)) {
		var __left0__ = stringChord.py_replace (':', '_').py_replace ('/', '_').py_split ('_');
		var root = __left0__ [0];
		var middle = __left0__ [1];
		var bass = __left0__ [2];
	}
	else if (__in__ (':', stringChord)) {
		var __left0__ = stringChord.py_split (':');
		var root = __left0__ [0];
		var middle = __left0__ [1];
	}
	else if (__in__ ('/', stringChord)) {
		var __left0__ = stringChord.py_split ('/');
		var root = __left0__ [0];
		var bass = __left0__ [1];
	}
	else {
		var root = stringChord;
	}
	var intervals = middleToIntervals (middle);
	return Chord (root, intervals, bass);
};
export var middleToIntervals = function (stringRep) {
	if (stringRep [0] != '(' && __in__ ('(', stringRep)) {
		var __left0__ = stringRep.py_split ('(');
		var shorthand = __left0__ [0];
		var modifiers = __left0__ [1];
		var modifiers = modifiers.py_replace (')', '');
		var modifiers = modifiers.py_split (',');
		var intervals = Tables ['intervals'] ['shorthandToIntervals'] [shorthand];
		var intervals = list (map (stringIntervalToTuple, intervals));
		var modifiers = list (map (stringIntervalToTuple, modifiers));
		var intervals = applyModifiers (intervals, modifiers);
	}
	else if (stringRep [0] == '(') {
		var intervals = stringRep.__getslice__ (1, -(1), 1);
		var intervals = intervals.py_split (',');
		var intervals = list (map (stringIntervalToTuple, intervals));
	}
	else if (!__in__ ('(', stringRep)) {
		var shorthand = stringRep;
		var intervals = Tables ['intervals'] ['shorthandToIntervals'] [shorthand];
		var intervals = list (map (stringIntervalToTuple, intervals));
	}
	return intervals;
};
export var applyModifiers = function (intervals, modifiers) {
	for (var i = len (intervals) - 1; i > -(1); i--) {
		for (var j = len (modifiers) - 1; j > -(1); j--) {
			if (intervals [i] [0] == modifiers [j] [0]) {
				if (modifiers [j] [1] == -(1)) {
					intervals.py_pop (i);
					modifiers.py_pop (j);
					break;
				}
				else {
					intervals [i] = modifiers [j];
					modifiers.py_pop (i);
					break;
				}
			}
		}
	}
	for (var modifier of modifiers) {
		intervals.append (modifier);
	}
	return intervals;
};
export var stringIntervalToTuple = function (stringInterval) {
	if (stringInterval [0] == '*') {
		var interval = tuple ([int (stringInterval [stringInterval.length -(1)]), -(1)]);
	}
	else {
		var interval = Tables ['intervals'] ['intervalToTuple'] [stringInterval];
	}
	return interval;
};

//# sourceMappingURL=PyChordParser.map