-- Table to keep track of  users
    -- user_id = the primary key 
    -- username = the username set by the user
    -- pass = the password set by the user
    -- fname = user first name
    -- lname = user last name
    -- email = user email address
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    fname VARCHAR(255),
    lname VARCHAR(255),
    email VARCHAR(255)
);

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
CREATE TABLE Options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    option_text TEXT,
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id)
);

-- Tags table for storing tags
    -- tag_id = a unique id for the tag
    -- tag_name = the name of a tag made by user/provided by us
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name TEXT
);

-- Table to identify the tags attached to specific polls
    -- poll_id = id of the poll that a tag is attached to
    -- Question - will tags be unique, or will we just pull all duplicate tag/poll 
    -- pairs when we need to list all polls with a certain tag?
CREATE TABLE PollsTags (
    tag_id INT,
    poll_id INT,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id),
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id)
    PRIMARY KEY(tag_id, poll_id)
);

-- Table to keep track of  votes
    -- vote_id = the primary key of this table
    -- user_id = the id that corresponds w a user id
    -- poll_id = the id that corresponds w a user id

CREATE TABLE Votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    option_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (option_id) REFERENCES Options(option_id)
);

-- Comments table for storing poll comments
    -- comment_id = unique id for comment
    -- user_id = id of user in which option is associated with
    -- poll_id = id of poll in which option is associated with
    -- parent_id = the comment that this comment is replying to. 
       -- NULL if this is the first comment in the chain
    -- comment = textual content of user comment
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    poll_id INT,
    parent_id INT,
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (poll_id) REFERENCES Polls(poll_id),
    FOREIGN KEY (parent_id) REFERENCES Comments(comment_id)
);

INSERT INTO Tags (tag_name)
VALUES
    ('funny'),
    ('politics'),
    ('gaming'),
    ('movies')