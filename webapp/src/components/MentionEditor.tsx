import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import './styles/editor.css';
import './styles/mentions.css';
import './styles/emoji.css';

import { compose } from 'draft-extend';
import { convertToHTML, convertFromHTML, parseHTML } from 'draft-convert';

import mentions from './mentions';

const MentionEntry = (props) => {
    const {
        mention,
        searchValue, // eslint-disable-line no-unused-vars
        isFocused, // eslint-disable-line no-unused-vars
        ...parentProps
    } = props;

    return (
        <div {...parentProps}>
            <div className='mentionSuggestionsEntryContainer'>
                <div className='mentionSuggestionsEntryContainerLeft'>
                    <img
                        src={mention.get('avatar')}
                        className='mentionSuggestionsEntryAvatar'
                        role="presentation"
                    />
                </div>

                <div className='mentionSuggestionsEntryContainerRight'>
                    <div className='mentionSuggestionsEntryText'>
                        {mention.get('name')}
                    </div>

                    <div className='mentionSuggestionsEntryTitle'>
                        {mention.get('title')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default class MentionEditor extends Component {

    mentionPlugin: any;
    emojiPlugin: any;
    editor: Editor;
    plugins: any[] = [];
    html?: string;

    constructor(props) {
        super(props);

        this.emojiPlugin = createEmojiPlugin({
            selectButtonContent: '☻',
            useNativeArt: true,
        });
        
        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            mentionPrefix: '@',
        });

        this.plugins = [this.mentionPlugin, this.emojiPlugin];
    }

    state = {
        editorState: EditorState.createEmpty(),
        suggestions: mentions,
        isFocused: false,
    };

    onChange = (editorState: EditorState) => {
        this.setState({
            editorState,
        });

        this.html = convertToHTML({            
            entityToHTML: (entity, originalText) => {
                if (entity.type === 'mention') {
                    return <a href={entity.data.mention.get('avatar')}>{originalText}</a>;
                }
                console.log('entity', entity, originalText);
                return originalText;
            }
        })(editorState.getCurrentContent());

        console.log(this.html);
    };

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, mentions),
        });
    };

    onAddMention = () => {
        // get the mention object selected
    }

    focus = () => {
        this.editor.focus();
        this.setState({ isFocused: true });
    };

    blur = () => {
        let isFocused = this.html && this.html.replace(`<p></p>`, '').length > 0 ? true : false
        this.setState({ isFocused });
    };

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        const { EmojiSuggestions, EmojiSelect } = this.emojiPlugin;

        return (
            <div onClick={this.focus} >
                <div className={`editor ${this.state.isFocused ? 'editor_focused' : ''}`} >
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        onBlur={this.blur}
                        plugins={this.plugins}
                        ref={(element) => { this.editor = element; }}
                    />
                    <MentionSuggestions
                        onSearchChange={this.onSearchChange}
                        suggestions={this.state.suggestions}
                        onAddMention={this.onAddMention}
                        entryComponent={MentionEntry}
                    />
                    <EmojiSuggestions />
                </div>
                <div className='editor_options'>
                    <EmojiSelect />
                </div>
            </div>
        );
    }
}