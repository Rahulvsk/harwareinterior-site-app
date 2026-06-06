//internal import
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguageTwo = ({ handleSelectLanguage, register, language }) => {
  const { languages } = useUtilsFunction();

  // console.log("lang", lang, "languages", languages, "language", language);

  return (
    <>
      <select
        name="language"
        {...register(`language`, {
          required: `language is required!`,
        })}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="block w-20 h-8 border border-emerald-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700"
      >
        <option value={language} defaultChecked hidden>
          {language}
        </option>
        {languages?.map((lang) => (
          <option key={lang?._id} value={lang?.code}>
            {lang?.code}{" "}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectLanguageTwo;
