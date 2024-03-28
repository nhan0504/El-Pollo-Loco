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