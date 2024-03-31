-- Polls table for storing polls
    -- poll_id = unique id for poll
    -- user_id = id for user who created the poll
    -- title = prompt/question for users to answer
    -- created_at = stores creation date of poll (could be useful if we decide to make polls expire?)
CREATE TABLE Polls (
    poll_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Options table for storing poll options
    -- option_id = unique id for option
    -- poll_id = id of poll in which option is associated with
    -- option_text = text for specific option
    -- count = how many votes this option got
CREATE TABLE Options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    count INT,
    option_text TEXT,
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id)
);

-- Comments table for storing poll comments
    -- comment_id = unique id for comment
    -- user_id = id of user in which option is associated with
    -- poll_id = id of poll in which option is associated with
    -- comment = textual content of user comment
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENET PRIMARY KEY,
    user_id INT,
    poll_id INT,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id)
);

-- Tags table for storing tags
    -- tag_id = a unique id for the tag
    -- tag_name = the name of a tag made by user/provided by us
CREATE TABLE Tags (
    tag_id INT,
    tag_name TEXT
);

INSERT INTO Tags (tagid, tag_name)
VALUES
    (0, 'funny'),
    (1, 'politics'),
    (2, 'gaming'),
    (3, 'movies')

-- Table to identify the tags attached to specific polls
    -- poll_id = id of the poll that a tag is attached to
    -- Question - will tags be unique, or will we just pull all duplicate tag/poll 
    -- pairs when we need to list all polls with a certain tag?
CREATE TABLE PollTags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id)
);

-- Table to keep track of  votes
    -- vote_id = the primary key of this table
    -- user_id = the id that corresponds w a user id
    -- poll_id = the id that corresponds w a user id
    -- count = not really sure, since option has a count?

CREATE TABLE Votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    poll_id INT,
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id),
    option_id INT,
    count INT
);
