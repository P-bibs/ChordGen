# ChordGen

Using machine learning to aid composition and improvisation.

[See the live version](paulbiberstein.me/chordgen)

## A Modern Tool for Musicians

The project uses a recurrent neural network trained on thousands of jazz standards to suggest consonant chord progressions for the asipring improvisor or composer.

By allowing the user to generate new chord progressions at will and then play them back with a variety of configurations and instruments, ChordGen speeds up the process of learning to improvise over foreign chords in a jazz piece, or provides a motif to inspie a composer's next work.

## How it Works

[A dataset](https://github.com/keunwoochoi/lstm_real_book/blob/master/more_data_to_play_with/jazz_xlab.zip) of jazz standards was preprocessed using the [PyChord](https://github.com/P-bibs/PyChord) library to reduce each chord in each song to a length 12 binary array (with notes present in the chord represented as 1 and notes not present represented as 0). From there the processed dataset was fed into [the network](https://github.com/P-bibs/ChordGenModel) to generate a model. This model is loaded into the website with [TensorFlowJS](https://www.tensorflow.org/js) and some frontend logic handles configuration and playback.

## Wanna Learn More?

Head over to [chordgen.com](chordgen.com) to see it in action and learn more about the actual usage, or reach out to me here with questions.