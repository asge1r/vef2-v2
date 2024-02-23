CREATE TABLE
IF
  NOT EXISTS public.teams (id SERIAL PRIMARY KEY, name VARCHAR(64) NOT NULL UNIQUE);

  CREATE TABLE
  IF
    NOT EXISTS public.games (
      id SERIAL PRIMARY KEY
      , date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
      , home INTEGER NOT NULL
      , away INTEGER NOT NULL
      , home_score INTEGER NOT NULL CHECK (home_score >= 0)
      , away_score INTEGER NOT NULL CHECK (away_score >= 0)
      , CONSTRAINT fk_teams_home FOREIGN KEY (home) REFERENCES teams (id)
      , CONSTRAINT fk_teams_away FOREIGN KEY (away) REFERENCES teams (id)
    );

    CREATE TABLE
    IF
      NOT EXISTS public.users (
        id SERIAL PRIMARY KEY
        , name VARCHAR(64) NOT NULL
        , username VARCHAR(64) NOT NULL UNIQUE
        , password VARCHAR(256) NOT NULL
        , admin BOOLEAN DEFAULT false
      );
